import { connectToDatabase } from '@/lib/mongoose';
import attendance from '@/app/models/attendanceSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectToDatabase();

    const { date, subject, topic, teacherId, department, year, division, students } = await req.json();

    // Validate required fields
    if (!date || !subject || !teacherId || !students || !Array.isArray(students)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields' 
      }, { status: 400 });
    }

    // Create attendance record
    const attendanceRecord = new attendance({
      courseId: teacherId, // Using teacherId as courseId for simplicity
      date: new Date(date),
      topic: topic || `${subject} - Lecture`,
      attendanceRecords: students.map(student => ({
        studentId: student.studentId,
        isPresent: student.isPresent
      })),
      teacherId: teacherId,
      subject: subject,
      year: year || '1st Year',
      division: division || 'A',
      department: department || 'Computer Science'
    });

    await attendanceRecord.save();

    return NextResponse.json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendanceRecord
    });

  } catch (error) {
    console.error('[MARK_ATTENDANCE_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal Server Error' 
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const teacherId = searchParams.get('teacherId');

    let query = {
      date: {
        $gte: new Date(date + "T00:00:00.000Z"),
        $lt: new Date(date + "T23:59:59.999Z")
      }
    };

    if (teacherId) {
      query.teacherId = teacherId;
    }

    const attendanceRecords = await attendance.find(query)
      .populate('attendanceRecords.studentId', 'fullName studentId email')
      .lean();

    return NextResponse.json({
      success: true,
      data: attendanceRecords
    });

  } catch (error) {
    console.error('[GET_ATTENDANCE_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal Server Error' 
    }, { status: 500 });
  }
}
