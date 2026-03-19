import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import StudentAttendance from '@/models/studentAttendance';

export async function POST(req) {
  await connectToDatabase();

  try {
    const {
      facultyId,
      date,
      subject,
      course,
      semester,
      attendance
    } = await req.json();

    // ✅ Validate required fields
    if (!facultyId || !date || !subject || !course || !semester || !attendance || !Array.isArray(attendance)) {
      return NextResponse.json({
        success: false,
        message: 'Missing or invalid fields'
      }, { status: 400 });
    }

    // ✅ Check if attendance already exists
    const alreadyMarked = await StudentAttendance.findOne({
      facultyId,
      date: new Date(date),
      subject,
      course,
      semester,
    });

    if (alreadyMarked) {
      return NextResponse.json({
        success: false,
        message: 'Attendance already marked for this date and subject'
      }, { status: 400 });
    }

    // ✅ Save new attendance record
    const newAttendance = new StudentAttendance({
      facultyId,
      date: new Date(date),
      subject,
      course,
      semester,
      attendance
    });

    await newAttendance.save();

    return NextResponse.json({
      success: true,
      message: 'Attendance marked successfully'
    });

  } catch (err) {
    console.error('Attendance Marking Error:', err);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error'
    }, { status: 500 });
  }
}
