import { connectToDatabase } from '@/lib/mongoose';
import Admission from '@/app/models/admissionSchema';
import Student from '@/app/models/studentSchema';
import User from '@/app/models/userSchema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    console.log("🔍 Diagnosing approval to student profile flow...");

    const results = {
      admissions: {
        total: 0,
        approved: 0,
        inProcess: 0,
        rejected: 0
      },
      students: {
        total: 0,
        withPrn: 0,
        active: 0
      },
      users: {
        total: 0,
        students: 0
      },
      issues: []
    };

    // Check admissions
    const allAdmissions = await Admission.find({});
    results.admissions.total = allAdmissions.length;
    results.admissions.approved = allAdmissions.filter(a => a.status === 'approved').length;
    results.admissions.inProcess = allAdmissions.filter(a => a.status === 'inProcess').length;
    results.admissions.rejected = allAdmissions.filter(a => a.status === 'rejected').length;

    console.log(`📊 Admissions: ${results.admissions.total} total, ${results.admissions.approved} approved`);

    // Check students
    const allStudents = await Student.find({});
    results.students.total = allStudents.length;
    results.students.withPrn = allStudents.filter(s => s.prn).length;
    results.students.active = allStudents.filter(s => s.status === 'active').length;

    console.log(`🎓 Students: ${results.students.total} total, ${results.students.withPrn} with PRN`);

    // Check users
    const allUsers = await User.find({});
    results.users.total = allUsers.length;
    results.users.students = allUsers.filter(u => u.role === 'student').length;

    console.log(`👥 Users: ${results.users.total} total, ${results.users.students} students`);

    // Find issues
    const approvedAdmissionsWithoutStudents = allAdmissions.filter(admission => 
      admission.status === 'approved' && !allStudents.some(student => 
        student.admissionId && student.admissionId.toString() === admission._id.toString()
      )
    );

    if (approvedAdmissionsWithoutStudents.length > 0) {
      results.issues.push({
        type: 'approved_without_student',
        count: approvedAdmissionsWithoutStudents.length,
        details: approvedAdmissionsWithoutStudents.map(a => ({
          id: a._id,
          fullName: a.fullName,
          email: a.email,
          status: a.status
        }))
      });
      console.log(`⚠️ Found ${approvedAdmissionsWithoutStudents.length} approved admissions without students`);
    }

    const studentsWithoutUsers = allStudents.filter(student => 
      !allUsers.some(user => user.username === student.studentId)
    );

    if (studentsWithoutUsers.length > 0) {
      results.issues.push({
        type: 'students_without_users',
        count: studentsWithoutUsers.length,
        details: studentsWithoutUsers.map(s => ({
          studentId: s.studentId,
          fullName: s.fullName,
          email: s.email
        }))
      });
      console.log(`⚠️ Found ${studentsWithoutUsers.length} students without user accounts`);
    }

    const usersWithoutStudents = allUsers.filter(user => 
      user.role === 'student' && !allStudents.some(student => student.studentId === user.username)
    );

    if (usersWithoutStudents.length > 0) {
      results.issues.push({
        type: 'users_without_students',
        count: usersWithoutStudents.length,
        details: usersWithoutStudents.map(u => ({
          username: u.username,
          email: u.email,
          fullName: u.fullName
        }))
      });
      console.log(`⚠️ Found ${usersWithoutStudents.length} user accounts without student records`);
    }

    return NextResponse.json({
      success: true,
      message: "Diagnosis completed",
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Diagnosis error:', error);
    return NextResponse.json({
      success: false,
      message: "Diagnosis failed",
      error: error.message
    }, { status: 500 });
  }
}
