import { connectToDatabase } from '@/lib/mongoose';
import Academic from '@/app/models/academicSchema';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    await connectToDatabase();

    // Check if these departments already exist
    const existingMechanical = await Academic.findOne({ department: 'Mechanical' });
    const existingCAE = await Academic.findOne({ department: 'Mechanical Lower and Upper CAE' });

    const results = [];

    // Create Mechanical department if it doesn't exist
    if (!existingMechanical) {
      const mechanical = new Academic({
        department: 'Mechanical',
        description: 'Mechanical Engineering Department',
        isActive: true,
        years: [
          {
            year: '1st Year',
            semester: '1st Semester',
            divisions: [
              { name: 'A', subjects: [], timetable: [], exams: [], attendance: [] },
              { name: 'B', subjects: [], timetable: [], exams: [], attendance: [] }
            ]
          },
          {
            year: '2nd Year',
            semester: '3rd Semester',
            divisions: [
              { name: 'A', subjects: [], timetable: [], exams: [], attendance: [] },
              { name: 'B', subjects: [], timetable: [], exams: [], attendance: [] }
            ]
          },
          {
            year: '3rd Year',
            semester: '5th Semester',
            divisions: [
              { name: 'A', subjects: [], timetable: [], exams: [], attendance: [] }
            ]
          },
          {
            year: '4th Year',
            semester: '7th Semester',
            divisions: [
              { name: 'A', subjects: [], timetable: [], exams: [], attendance: [] }
            ]
          }
        ]
      });

      await mechanical.save();
      results.push({ department: 'Mechanical', status: 'created' });
    } else {
      // Update existing to be active
      await Academic.updateOne({ _id: existingMechanical._id }, { isActive: true });
      results.push({ department: 'Mechanical', status: 'updated to active' });
    }

    // Create Mechanical Lower and Upper CAE department if it doesn't exist
    if (!existingCAE) {
      const cae = new Academic({
        department: 'Mechanical Lower and Upper CAE',
        description: 'Mechanical Engineering with Computer Aided Engineering',
        isActive: true,
        years: [
          {
            year: '1st Year',
            semester: '1st Semester',
            divisions: [
              { name: 'A', subjects: [], timetable: [], exams: [], attendance: [] },
              { name: 'B', subjects: [], timetable: [], exams: [], attendance: [] }
            ]
          },
          {
            year: '2nd Year',
            semester: '3rd Semester',
            divisions: [
              { name: 'B', subjects: [], timetable: [], exams: [], attendance: [] }
            ]
          },
          {
            year: '3rd Year',
            semester: '5th Semester',
            divisions: [
              { name: 'A', subjects: [], timetable: [], exams: [], attendance: [] }
            ]
          },
          {
            year: '4th Year',
            semester: '7th Semester',
            divisions: [
              { name: 'A', subjects: [], timetable: [], exams: [], attendance: [] }
            ]
          }
        ]
      });

      await cae.save();
      results.push({ department: 'Mechanical Lower and Upper CAE', status: 'created' });
    } else {
      // Update existing to be active
      await Academic.updateOne({ _id: existingCAE._id }, { isActive: true });
      results.push({ department: 'Mechanical Lower and Upper CAE', status: 'updated to active' });
    }

    return NextResponse.json({
      success: true,
      message: 'Departments created/updated successfully',
      results: results
    }, { status: 200 });

  } catch (error) {
    console.error('[CREATE_DEPARTMENTS_ERROR]', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create departments',
      error: error.message
    }, { status: 500 });
  }
}
