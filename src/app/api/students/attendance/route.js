import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import StudentAttendance from '@/models/studentAttendance';

export async function GET(req) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(req.url);

    const studentId = searchParams.get('studentId');
    const subject = searchParams.get('subject');
    const date = searchParams.get('date'); // Optional
    const course = searchParams.get('course');
    const semester = searchParams.get('semester');

    // Build dynamic query
    const query = {};

    if (subject) query.subject = subject;
    if (course) query.course = course;
    if (semester) query.semester = parseInt(semester);
    if (date) query.date = new Date(date);

    // Must filter by studentId inside attendance array
    if (studentId) query.attendance = { $elemMatch: { studentId } };

    const records = await StudentAttendance.find(query);

    // Optional: Filter attendance for that student only (for cleaner response)
    const result = records.map((record) => {
      if (studentId) {
        const studentAttendance = record.attendance.find(a => a.studentId === studentId);
        return {
          date: record.date,
          subject: record.subject,
          course: record.course,
          semester: record.semester,
          status: studentAttendance?.status || 'N/A'
        };
      }
      return record;
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (err) {
    console.error('GET attendance error:', err);
    return NextResponse.json({
      success: false,
      error: 'Server error'
    }, { status: 500 });
  }
}
