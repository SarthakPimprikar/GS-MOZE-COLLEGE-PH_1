import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/app/lib/mongodb';
import Role from '@/models/Role';
import User from '@/models/user';
import { adminSidebarItems } from '@/data/data';
//sample
export async function GET() {
    try {
        await connectToDatabase();

        // Admin permissions based on data.js adminSidebarItems
        const adminPermissions = adminSidebarItems.map(item => `sidebar.${item.id}`);

        // Try to find the Admin role
        let adminRole = await Role.findOne({ name: 'Admin' });

        if (!adminRole) {
            // Create Admin role if it doesn't exist
            adminRole = new Role({
                name: 'Admin',
                description: 'Administrative access with full system control',
                permissions: adminPermissions,
                isSystem: true // Setting to true to prevent accidental deletion in the future
            });
            await adminRole.save();
            return NextResponse.json({ message: 'Admin role created successfully with all permissions.', role: adminRole }, { status: 201 });
        } else {
            // Update permissions if role exists
            adminRole.permissions = adminPermissions;
            adminRole.isSystem = true;
            await adminRole.save();
        }

        // Update all existing admins to point to this new roleId
        const updatedUsers = await User.updateMany(
            { role: { $regex: /^admin$/i } },
            { $set: { roleId: adminRole._id } }
        );

        return NextResponse.json({
            message: 'Admin role seeded and users updated successfully.',
            role: adminRole,
            usersUpdated: updatedUsers.modifiedCount
        }, { status: 200 });

    } catch (error) {
        console.error("Error seeding Admin role:", error);
        return NextResponse.json({ error: 'Failed to seed Admin role', details: error.message }, { status: 500 });
    }
}
