import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Role from '@/models/Role';
import User from '@/app/models/userSchema';
import teacherSchema from '@/app/models/teacherSchema';
import studentSchema from '@/app/models/studentSchema';
import { adminSidebarItems } from '@/data/data';

export async function GET() {
    try {
        await connectToDatabase();

        // Admin permissions based on data.js adminSidebarItems
        const adminPermissions = adminSidebarItems.map(item => `sidebar.${item.id}`);

        const rolesToCreate = [
            {
                name: 'Admin',
                description: 'Administrative access with full system control',
                permissions: adminPermissions,
                dbRoleMatch: { $regex: /^admin$/i },
                userModel: User,
            },
            {
                name: 'Super Admin',
                description: 'Super Admin with absolute control',
                permissions: [...adminPermissions, 'sidebar.blogs'],
                dbRoleMatch: { $regex: /^superadmin$/i },
                userModel: User,
            },
            {
                name: 'Teacher',
                description: 'Teaching staff with classroom and exam access',
                permissions: [
                    'sidebar.overview',
                    'sidebar.attendance',
                    'sidebar.course-plan',
                    'sidebar.exam',
                    'sidebar.marks',
                    'sidebar.my-classes',
                    'sidebar.report',
                    'sidebar.student-list',
                    'sidebar.upload-notes'
                ],
                dbRoleMatch: { $regex: /^teacher$/i },
                userModel: teacherSchema,
            },
            {
                name: 'HOD',
                description: 'Head of Department access',
                permissions: [
                    'sidebar.academic-management',
                    'sidebar.student-management',
                    'sidebar.timetable'
                ],
                dbRoleMatch: { $regex: /^hod$/i },
                userModel: teacherSchema,
            },
            {
                name: 'Staff',
                description: 'Non-teaching staff with specific operational access',
                permissions: [
                    'sidebar.overview',
                    'sidebar.application-management',
                    'sidebar.enquiry&leads',
                    'sidebar.profile'
                ],
                dbRoleMatch: { $regex: /^staff$/i },
                userModel: User,
            },
            {
                name: 'Student',
                description: 'Student access to monitor own progress',
                permissions: [
                    'sidebar.profile',
                    'sidebar.assignments',
                    'sidebar.attendance',
                    'sidebar.certificates',
                    'sidebar.myexams',
                    'sidebar.studymaterial',
                    'sidebar.timetable'
                ],
                dbRoleMatch: { $regex: /^student$/i },
                userModel: studentSchema,
            },
            {
                name: 'HR',
                description: 'Human Resources Management',
                permissions: [
                    'sidebar.attendance',
                    'sidebar.home',
                    'sidebar.leave',
                    'sidebar.payslip',
                    'sidebar.salary',
                    'sidebar.staff'
                ],
                dbRoleMatch: { $regex: /^hr$/i },
                userModel: User,
            }
        ];

        let results = [];

        for (const roleDef of rolesToCreate) {
            let role = await Role.findOne({ name: { $regex: new RegExp(`^${roleDef.name}$`, 'i') } });

            if (!role) {
                // Create role if it doesn't exist
                role = new Role({
                    name: roleDef.name,
                    description: roleDef.description,
                    permissions: roleDef.permissions,
                    isSystem: true
                });
                await role.save();
                results.push({ name: roleDef.name, status: 'created' });
            } else {
                // Update permissions if role exists
                role.permissions = roleDef.permissions;
                role.isSystem = true;
                await role.save();
                results.push({ name: roleDef.name, status: 'updated' });
            }

            // Update all existing users with this role to point to this new roleId
            if (roleDef.userModel) {
                await roleDef.userModel.updateMany(
                    { role: roleDef.dbRoleMatch },
                    { $set: { roleId: role._id } }
                );
            }
        }

        return NextResponse.json({
            message: 'Roles seeded and users updated successfully.',
            results
        }, { status: 200 });

    } catch (error) {
        console.error("Error seeding roles:", error);
        return NextResponse.json({ error: 'Failed to seed roles', details: error.message }, { status: 500 });
    }
}
