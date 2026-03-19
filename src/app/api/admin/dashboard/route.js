// src/app/api/admin/dashboard/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';

import Student from '@/models/student';
//import Faculty from '@/models/faculty';
import Course from '@/models/course';
import studentAttendance from '@/models/studentAttendance';
import { FeeReceipt } from '@/models/feeReceipt';

export async function GET() {
  await connectToDatabase();

  try {
    // === STATS OVERVIEW ===
    const totalStudents = await Student.countDocuments();
    // const totalFaculty = await Faculty.countDocuments();
    const totalCourses = await Course.countDocuments();

    const totalFeeCollected = await FeeReceipt.aggregate([
      { $group: { _id: null, total: { $sum: "$amountPaid" } } }
    ]);
    const feeCollected = totalFeeCollected[0]?.total || 0;

    // === ATTENDANCE SUMMARY ===
    const today = new Date().toISOString().split('T')[0];
    const attendanceToday = await studentAttendance.find({ date: today });
    const totalPresent = attendanceToday.filter(a => a.status === 'Present').length;
    const totalAbsent = attendanceToday.filter(a => a.status === 'Absent').length;

    // === GRAPH: Monthly Admissions ===
    const admissionsByMonth = await Student.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // === GRAPH: Monthly Fee Collection ===
    const monthlyFeeData = await FeeReceipt.aggregate([
      {
        $group: {
          _id: { $month: "$paymentDate" },
          total: { $sum: "$amountPaid" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        //totalFaculty,
        totalCourses,
        feeCollected,
        attendanceToday: {
          totalPresent,
          totalAbsent
        }
      },
      graphs: {
        admissionsByMonth,
        monthlyFeeCollection: monthlyFeeData
      }
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    return NextResponse.json({ success: false, error: "Failed to load dashboard data" }, { status: 500 });
  }
}
