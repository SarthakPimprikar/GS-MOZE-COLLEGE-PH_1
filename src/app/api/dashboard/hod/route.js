// src/app/api/dashboard/hod/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Student from '@/app/models/studentSchema';
import Teacher from '@/app/models/teacherSchema';

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const hodId = searchParams.get('hodId');
    const listType = searchParams.get('listType'); // 'students' or 'teachers'

    if (!hodId) {
      return NextResponse.json({ error: 'Missing HOD ID' }, { status: 400 });
    }

    const hodUser = await Teacher.findById(hodId);
    if (!hodUser || hodUser.role !== 'hod') {
      return NextResponse.json({ error: 'HOD not found or invalid role' }, { status: 404 });
    }

    const department = hodUser.department?.trim();

    if (listType) {
      if (!department) {
        return NextResponse.json([]);
      }

      if (listType === 'students') {
        const students = await Student.find({ branch: department })
          .select('fullName email status studentId')
          .lean();

        return NextResponse.json(students);
      } else if (listType === 'teachers') {
        // Use exact department match
        const teachers = await Teacher.find({
          department: department,
          role: 'teacher',
        })
          .select('teacherId fullName email phone')
          .lean();

        return NextResponse.json(teachers);
      } else if (listType === 'activeStudents') {
        const activeStudents = await Student.find({ 
          branch: department,
          status: 'active'
        })
          .select('fullName email status studentId')
          .lean();

        return NextResponse.json(activeStudents);
      }
    }

    if (!department) {
      // Return graceful default data rather than throwing an error 
      // if the HOD has not yet been assigned a department
      return NextResponse.json({
        department: "Unassigned",
        totalStudents: 0,
        totalTeachers: 0,
        activeStudents: 0,
        attendanceRate: 0,
      });
    }

    // Default dashboard stats
    const totalStudents = await Student.countDocuments({
      branch: department,
    });

    const totalTeachers = await Teacher.countDocuments({
      department: department,
      role: 'teacher',
    });

    const activeStudents = await Student.countDocuments({
      branch: department,
      status: 'active',
    });

    const attendanceRate = 92.5; // Placeholder

    return NextResponse.json({
      department,
      totalStudents,
      totalTeachers,
      activeStudents,
      attendanceRate: parseFloat(attendanceRate.toFixed(2)),
    });
  } catch (error) {
    console.error('Error in HOD Dashboard API:', error);
    return NextResponse.json({ error: 'Failed to fetch HOD dashboard data' }, { status: 500 });
  }
}
