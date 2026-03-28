
import { cookies } from 'next/headers';
import userSchema from '../../../models/userSchema';
import Role from '../../../../models/Role';
import teacherSchema from '../../../models/teacherSchema';
import studentSchema from '../../../models/studentSchema';
import { connectToDatabase } from '../../../lib/mongodb';
//sample
// export async function GET() {
//   try {
//     await connectToDatabase();

//     const cookieStore = cookies();
//     const sessionToken = cookieStore.get('sessionToken')?.value;
//     const role = cookieStore.get('role')?.value;

//     console.log("Session token from cookies:", sessionToken);
//     console.log("Role from cookies:", role);

//     if (!sessionToken || !role) {
//       console.log('No session token or role found');
//       return Response.json({ user: null }, { status: 200 });
//     }

//     // If HOD, search in teacher schema
//     if (role === 'hod') {
//       const hod = await teacherSchema.findOne({ sessionToken }).select('-password');
//       if (!hod) {
//         return Response.json({ user: null }, { status: 404 });
//       }
//       console.log(hod)
//       return Response.json({
//         user: {
//           id: hod._id.toString(),
//           fullName: hod.fullName,
//           email: hod.email,
//           role: 'hod',
//           department: hod.department,
//           teacherId: hod.teacherId,
//           isHod: true,
//         },
//       });
//     }

//     // For other roles, search in user schema
//     const user = await userSchema.findOne({ sessionToken }).select('-password');
//     if (!user) {
//       return Response.json({ user: null }, { status: 200 });
//     }

//     return Response.json({
//       user: {
//         id: user._id.toString(),
//         username: user.fullName,
//         email: user.email,
//         role: user.role,
//       },
//     });

//   } catch (error) {
//     console.error('Session error:', error);
//     return Response.json({ user: null, message: 'Error fetching session' }, { status: 500 });
//   }
// }

export async function GET() {
  try {
    await connectToDatabase();

    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken')?.value;
    const role = cookieStore.get('role')?.value;


    console.log("Session token from cookies:", sessionToken);
    console.log("Role from cookies:", role);
    console.log(role)

    if (!sessionToken || !role) {
      console.log('No session token or role found');
      return Response.json({ user: null }, { status: 200 });
    }

    // If HOD, search in teacher schema
    if (role === 'hod' || role === "teacher") {
      const hod = await teacherSchema.findOne({ sessionToken }).select('-password');
      console.log(hod)
      if (!hod) {
        return Response.json({ user: null }, { status: 404 });
      }

      return Response.json({
        user: {
          id: hod._id.toString(),
          fullName: hod.fullName,
          email: hod.email,
          role: hod.role,
          department: hod.department,
          teacherId: hod.teacherId,
          // isHod: true,
        },
      });
    }

    // ✅ Student logic
    if (role === 'student') {
      console.log("Checking session for student role...");
      // 1. Check legacy studentSchema
      const student = await studentSchema.findOne({ sessionToken });
      if (student) {
        return Response.json({
          id: student._id.toString(),
          fullName: student.fullName,
          studentId: student.studentId,
          email: student.email,
          address: student.address,
          role: 'student',
        });
      }

      // 2. Check userSchema for prospective students (Admission Phase)
      const user = await userSchema.findOne({ sessionToken, role: "student" }).select('-password');
      if (user) {
        return Response.json({
          user: {
            id: user._id.toString(),
            fullName: user.fullName,
            username: user.fullName,
            email: user.email,
            role: 'student',
            admissionId: user.admissionId
          }
        });
      }

      return Response.json({ user: null }, { status: 404 });
    }

    // ✅ Other roles (admin, staff, parents)
    const user = await userSchema.findOne({ sessionToken }).select('-password').populate('roleId');

    console.log("DEBUG SESSION: User found:", user?.email);
    console.log("DEBUG SESSION: RoleID field:", user?.roleId);

    if (user?.roleId instanceof Object) {
      console.log("DEBUG SESSION: Populated Role Permissions:", user.roleId.permissions);
    } else {
      console.log("DEBUG SESSION: RoleID is not populated object:", user?.roleId);
    }

    if (!user) {
      return Response.json({ user: null }, { status: 200 });
    }

    return Response.json({
      user: {
        id: user._id.toString(),
        username: user.fullName,
        email: user.email,
        // Normalize role to ensure "Super Admin" becomes "superadmin" for frontend consistency
        role: user.role.toLowerCase().replace(/\s+/g, ''),
        roleId: user.roleId,
      },
    });

  } catch (error) {
    console.error('Session error:', error);
    return Response.json(
      { user: null, message: 'Error fetching session' },
      { status: 500 }
    );
  }
}