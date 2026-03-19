import { Types } from 'mongoose';
import mongoose from 'mongoose';
import { connectToDatabase } from '../../../../lib/mongodb';
import attendanceSchema from '../../../../models/attendanceSchema';
import Student from '../../../../models/studentSchema';
import teacherSchema from '../../../../models/teacherSchema';
import academicSchema from '../../../../models/academicSchema';
import userSchema from '../../../../models/userSchema'; // Assuming HOD is in 'User' model
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid HOD ID' }, { status: 400 });
    }

    // Step 1: Get HOD's department from User model
    const hod = await teacherSchema.findById(id).lean();

    if (!hod || !hod.department) {
      return NextResponse.json({ message: 'HOD or department not found' }, { status: 404 });
    }

    // Step 2: Get ALL students from Student collection for this department
    // Match EXACT department name only - no variations
    const allDepartmentStudents = await Student.find({ 
      branch: hod.department 
    })
    .select('fullName studentId email status currentYear division')
    .lean();

    // Force use of student data only - no academic fallback
    if (allDepartmentStudents.length === 0) {
      return NextResponse.json({ years: [] }, { status: 200 });
    }

    // Transform student data
    const allStudents = allDepartmentStudents.map(student => ({
      id: student._id,
      name: student.fullName || 'Unnamed',
      roll: student.studentId || 'N/A',
      email: student.email || '',
      status: student.status || 'active',
      currentYear: student.currentYear || 'Not Assigned',
      division: student.division || 'Not Assigned',
      attendance: {} // Will be populated if attendance data exists
    }));

    
    // Step 6: Group by year for frontend compatibility
    const studentsByYear = {};
    allStudents.forEach(student => {
      const yearKey = student.currentYear || 'Not Assigned';
      if (!studentsByYear[yearKey]) {
        studentsByYear[yearKey] = [];
      }
      
      // Check if division already exists for this year
      let division = studentsByYear[yearKey].find(d => d.division === student.division);
      if (!division) {
        division = {
          division: student.division,
          students: []
        };
        studentsByYear[yearKey].push(division);
      }
      
      division.students.push(student);
    });

    // Step 7: Transform data to match expected format
    const transformed = {
      years: Object.keys(studentsByYear).map(year => ({
        year: year,
        semester: 'Sem 1', // Default semester
        divisions: studentsByYear[year]
      }))
    };

    return NextResponse.json(transformed, { status: 200 });

  } catch (error) {
    console.error('Error fetching academic data:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// ➤ Build subject-wise attendance percentages
function buildStudentAttendance(attendanceRecords, year, semester, division, studentId) {
  const subjectMap = {};

  attendanceRecords
    .filter(record =>
      record.year === year &&
      record.semester === semester &&
      record.division === division
    )
    .forEach(record => {
      const subject = record.subject || 'Unknown Subject';
      const studentEntry = record.students.find(s => s.studentId?.toString() === studentId.toString());
      if (!studentEntry) return;

      if (!subjectMap[subject]) subjectMap[subject] = { total: 0, present: 0 };

      subjectMap[subject].total += 1;
      if (studentEntry.isPresent) {
        subjectMap[subject].present += 1;
      }
    });

  const percentageMap = {};
  for (const subject in subjectMap) {
    const { total, present } = subjectMap[subject];
    percentageMap[subject] = total > 0 ? Math.round((present / total) * 100) : 0;
  }

  return percentageMap;
}
