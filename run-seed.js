const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://delxn:delxn@cluster0.9huz0ct.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB.");

        const db = mongoose.connection.useDb('test');

        const Role = db.collection('roles');
        const User = db.collection('users');
        const Teacher = db.collection('teachers');
        const Student = db.collection('students');

        const rolesToCreate = [
            {
                name: 'Teacher',
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
                dbRoleMatch: /^teacher$/i,
                collection: Teacher
            },
            {
                name: 'HOD',
                permissions: [
                    'sidebar.academic-management',
                    'sidebar.student-management',
                    'sidebar.timetable'
                ],
                dbRoleMatch: /^hod$/i,
                collection: Teacher
            },
            {
                name: 'Staff',
                permissions: [
                    'sidebar.overview',
                    'sidebar.application-management',
                    'sidebar.enquiry&leads',
                    'sidebar.profile'
                ],
                dbRoleMatch: /^staff$/i,
                collection: User
            },
            {
                name: 'Student',
                permissions: [
                    'sidebar.profile',
                    'sidebar.assignments',
                    'sidebar.attendance',
                    'sidebar.certificates',
                    'sidebar.myexams',
                    'sidebar.studymaterial',
                    'sidebar.timetable'
                ],
                dbRoleMatch: /^student$/i,
                collection: Student
            },
            {
                name: 'HR',
                permissions: [
                    'sidebar.attendance',
                    'sidebar.home',
                    'sidebar.leave',
                    'sidebar.payslip',
                    'sidebar.salary',
                    'sidebar.staff'
                ],
                dbRoleMatch: /^hr$/i,
                collection: User
            }
        ];

        for (const roleDef of rolesToCreate) {
            let role = await Role.findOne({ name: { $regex: new RegExp(`^${roleDef.name}$`, 'i') } });

            if (!role) {
                const res = await Role.insertOne({
                    name: roleDef.name,
                    description: `${roleDef.name} access`,
                    permissions: roleDef.permissions,
                    isSystem: true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    __v: 0
                });
                role = { _id: res.insertedId };
                console.log(`Created Role: ${roleDef.name}`);
            } else {
                await Role.updateOne(
                    { _id: role._id },
                    { $set: { permissions: roleDef.permissions, isSystem: true, updatedAt: new Date() } }
                );
                console.log(`Updated Role: ${roleDef.name}`);
            }

            if (roleDef.collection) {
                const updateRes = await roleDef.collection.updateMany(
                    { role: roleDef.dbRoleMatch },
                    { $set: { roleId: role._id } }
                );
                console.log(`Mapped ${updateRes.modifiedCount} users to ${roleDef.name}`);
            }
        }

        console.log("Seeding complete.");
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
