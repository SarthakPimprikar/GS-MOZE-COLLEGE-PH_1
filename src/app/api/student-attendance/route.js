import { connectToDatabase } from '@/lib/mongoose';
import Student from '@/app/models/studentSchema';
import attendance from '@/app/models/attendanceSchema';
import Teacher from '@/app/models/teacherSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectToDatabase();
    
    const { courseId, date, topic, attendanceRecords, teacherId, subject, year, division, department } = await req.json();
    
    // Validate required fields
    if (!courseId || !date || !attendanceRecords || !teacherId || !subject || !year || !division || !department) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: courseId, date, attendanceRecords, teacherId, subject, year, division, department' 
      }, { status: 400 });
    }
    
    // Validate teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return NextResponse.json({ 
        success: false, 
        message: 'Teacher not found' 
      }, { status: 404 });
    }
    
    // Create attendance record
    const attendanceRecord = await attendance.create({
      courseId,
      date: new Date(date),
      topic: topic || '',
      attendanceRecords: attendanceRecords.map(record => ({
        studentId: record.studentId,
        isPresent: record.isPresent || false
      })),
      teacherId,
      subject,
      year,
      division,
      department
    });
    
    return NextResponse.json({
      success: true,
      message: 'Attendance saved successfully',
      data: attendanceRecord
    });
    
  } catch (error) {
    console.error('[POST_STUDENT_ATTENDANCE_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal Server Error',
      error: error.message 
    }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || new Date().toISOString().split('T')[0];
    const studentIdParam = searchParams.get("studentId");

    // Fetch attendance records for the given date
    const attendanceRecords = await attendance.find({
      date: {
        $gte: new Date(date + "T00:00:00.000Z"),
        $lt: new Date(date + "T23:59:59.999Z")
      }
    }).populate('attendanceRecords.studentId').lean();

    // Transform attendance data for accountant interface
    const attendanceData = [];
    
    attendanceRecords.forEach(record => {
      record.attendanceRecords.forEach(studentRecord => {
        if (studentRecord.studentId) {
          // Check if studentId matches (either by _id or studentId field)
          const shouldInclude = !studentIdParam || 
            studentRecord.studentId._id.toString() === studentIdParam ||
            studentRecord.studentId.studentId === studentIdParam;
          
          if (!shouldInclude) {
            return;
          }
          
          attendanceData.push({
            _id: studentRecord.studentId._id,
            studentName: studentRecord.studentId.fullName,
            studentId: studentRecord.studentId.studentId,
            department: record.department || studentRecord.studentId.branch || 'Not Assigned',
            year: record.year || studentRecord.studentId.currentYear || 'Not Assigned',
            date: new Date(record.date).toISOString().split('T')[0],
            status: studentRecord.isPresent ? 'Present' : 'Absent',
            checkIn: null,
            checkOut: null,
            email: studentRecord.studentId.email,
            phone: studentRecord.studentId.mobileNumber,
            subject: record.subject,
            course: record.courseId
          });
        }
      });
    });

    // If no attendance records found and specific student requested, get student info and mark as no record
    if (attendanceData.length === 0 && studentIdParam) {
      // Try to find student by _id or studentId field
      const student = await Student.findOne({
        $or: [
          { _id: studentIdParam },
          { studentId: studentIdParam }
        ]
      }).lean();
      
      if (student) {
        attendanceData.push({
          _id: student._id,
          studentName: student.fullName,
          studentId: student.studentId,
          department: student.branch || 'Not Assigned',
          year: student.currentYear || 'Not Assigned',
          date: date,
          status: 'No Record',
          checkIn: null,
          checkOut: null,
          email: student.email,
          phone: student.mobileNumber,
          subject: 'N/A',
          course: 'N/A'
        });
      }
    }

    // If no studentId specified and no records, get all students and mark as absent
    if (attendanceData.length === 0 && !studentIdParam) {
      const students = await Student.find({}).lean();
      students.forEach(student => {
        attendanceData.push({
          _id: student._id,
          studentName: student.fullName,
          studentId: student.studentId,
          department: student.branch || 'Not Assigned',
          year: student.currentYear || 'Not Assigned',
          date: date,
          status: 'No Record',
          checkIn: null,
          checkOut: null,
          email: student.email,
          phone: student.mobileNumber,
          subject: 'N/A',
          course: 'N/A'
        });
      });
    }

    // Calculate stats
    const totalStudents = attendanceData.length;
    const presentToday = attendanceData.filter(s => s.status === 'Present').length;
    const absentToday = attendanceData.filter(s => s.status === 'Absent').length;
    const noRecord = attendanceData.filter(s => s.status === 'No Record').length;
    const averageAttendance = totalStudents > 0 ? ((presentToday / totalStudents) * 100).toFixed(1) : 0;

    return NextResponse.json({
      success: true,
      data: attendanceData,
      stats: {
        totalStudents,
        presentToday,
        absentToday,
        noRecord,
        averageAttendance: parseFloat(averageAttendance)
      }
    });

  } catch (error) {
    console.error('[GET_STUDENT_ATTENDANCE_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal Server Error',
      error: error.message 
    }, { status: 500 });
  }
}
