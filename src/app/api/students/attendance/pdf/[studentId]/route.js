import { renderToStream } from '@react-pdf/renderer';
import {connectToDatabase} from "../../../../../lib/mongodb"
import StudentAttendance from '@/models/studentAttendance';
import Student from '@/models/student';
import StudentAttendancePDF from '@/components/studentAttendancePDF';

export async function GET(req, context ) {
  const { params } = context;
  const studentId = params.studentId;


  await connectToDatabase();
  

  const student = await Student.findOne({ studentId });

  if (!student) {
    return new Response(
      JSON.stringify({ success: false, message: 'Student not found' }),
      { status: 404 }
    );
  }

  // Fetch attendance where studentId is in embedded "attendance" array
  const records = await StudentAttendance.find({ 'attendance.studentId': studentId });

  if (records.length === 0) {
    return new Response(
      JSON.stringify({ success: false, message: 'No attendance records found' }),
      { status: 404 }
    );
  }

  // Flatten the data
  const attendance = [];
  
  for (const record of records) {
    const studentRecord = record.attendance.find(a => a.studentId === studentId);
    if (studentRecord) {
      attendance.push({
        date: record.date,
        subject: record.subject,
        course: record.course,
        semester: record.semester,
        status: studentRecord.status,
      });
    }
  }

  const pdfStream = await renderToStream(
    <StudentAttendancePDF
      studentName={student.name}
      studentId={studentId}
      attendance={attendance}
    />
  );

  return new Response(pdfStream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${studentId}_attendance.pdf"`,
    },
  });
}
