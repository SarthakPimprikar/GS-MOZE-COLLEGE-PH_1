// src/app/api/admin/user-dashboard/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';

import Student from '@/models/student';
import Faculty from '@/models/faculty';
import HR from '@/models/hr';
import Admin from '@/models/admin';
import { connect } from 'mongoose';

export async function GET() {
  await connectToDatabase();

  try {
    // Count Users by Role
    const [studentCount, facultyCount, hrCount, adminCount] = await Promise.all([
      Student.countDocuments(),
      Faculty.countDocuments(),
      HR.countDocuments(),
      Admin.countDocuments()
    ]);

    // Get user details by role
    const [students, faculty, hr, admins] = await Promise.all([
      Student.find({}, 'name rollNo course'), // select only name, rollNo, course
      Faculty.find({}, 'name department'),
      HR.find({}, 'name email'),
      Admin.find({}, 'name email')
    ]);

    return NextResponse.json({
      success: true,
      userCounts: {
        student: studentCount,
        faculty: facultyCount,
        hr: hrCount,
        admin: adminCount
      },
      usersByRole: {
        student: students,
        faculty: faculty,
        hr: hr,
        admin: admins
      }
    });

  } catch (error) {
    console.error("User Dashboard API Error:", error);
    return NextResponse.json({
      success: false,
      error: "Unable to fetch user dashboard data"
    }, { status: 500 });
  }
}
