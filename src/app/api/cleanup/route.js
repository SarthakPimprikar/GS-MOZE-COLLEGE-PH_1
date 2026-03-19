import { connectToDatabase } from '@/lib/mongoose';
import Student from '@/app/models/studentSchema';
import User from '@/app/models/userSchema';
import Admission from '@/app/models/admissionSchema';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await connectToDatabase();
    console.log("🧹 Starting database cleanup...");

    // 1. Find orphaned User records (users without corresponding Student records)
    const allUsers = await User.find({ role: 'student' });
    const allStudentIds = await Student.find({}, { studentId: 1 });
    const studentIdSet = new Set(allStudentIds.map(s => s.studentId));

    const orphanedUsers = allUsers.filter(user => !studentIdSet.has(user.username));
    console.log(`Found ${orphanedUsers.length} orphaned user records`);

    // Delete orphaned users
    for (const user of orphanedUsers) {
      await User.findByIdAndDelete(user._id);
      console.log(`🗑️ Deleted orphaned user: ${user.username}`);
    }

    // 2. Find admission records that are marked as approved but have no corresponding student
    const approvedAdmissions = await Admission.find({ status: 'approved' });
    const admissionIdSet = new Set(allStudentIds.map(s => s.admissionId?.toString()));

    const orphanedAdmissions = approvedAdmissions.filter(admission => 
      !admissionIdSet.has(admission._id.toString())
    );
    console.log(`Found ${orphanedAdmissions.length} orphaned approved admissions`);

    // Reset orphaned admissions back to inProcess
    for (const admission of orphanedAdmissions) {
      admission.status = 'inProcess';
      admission.prn = undefined;
      admission.isPrnGenerated = false;
      await admission.save();
      console.log(`🔄 Reset orphaned admission: ${admission._id}`);
    }

    // 3. Check for any students without corresponding users and create them
    const studentsWithoutUsers = [];
    for (const student of allStudentIds) {
      const userExists = await User.findOne({ username: student.studentId });
      if (!userExists) {
        studentsWithoutUsers.push(student);
      }
    }

    console.log(`Found ${studentsWithoutUsers.length} students without user records`);

    // Create missing user records
    for (const student of studentsWithoutUsers) {
      const fullStudent = await Student.findById(student._id);
      if (fullStudent) {
        await User.create({
          fullName: fullStudent.fullName,
          email: fullStudent.email,
          phone: fullStudent.mobileNumber,
          role: 'student',
          password: '$2a$10$default.password.hash.for.cleanup', // Default password
          username: fullStudent.studentId,
        });
        console.log(`➕ Created missing user for student: ${fullStudent.studentId}`);
      }
    }

    const cleanupResults = {
      orphanedUsersDeleted: orphanedUsers.length,
      orphanedAdmissionsReset: orphanedAdmissions.length,
      missingUsersCreated: studentsWithoutUsers.length,
      timestamp: new Date().toISOString()
    };

    console.log("✅ Database cleanup completed:", cleanupResults);

    return NextResponse.json({
      success: true,
      message: "Database cleanup completed successfully",
      results: cleanupResults
    });

  } catch (error) {
    console.error('❌ Cleanup error:', error);
    return NextResponse.json({
      success: false,
      message: "Cleanup failed",
      error: error.message
    }, { status: 500 });
  }
}
