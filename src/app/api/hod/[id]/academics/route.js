//hod can view academics of his/her department only 

import { connectToDatabase } from '../../../../lib/mongodb';
import teacherSchema from '../../../../models/teacherSchema';
import mongoose from 'mongoose';
import userSchema from '../../../../models/userSchema';
import academicSchema from '../../../../models/academicSchema';
import { NextResponse } from 'next/server';

//GET route handler to fetch his department's academic detials

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const {id} = await params;
    const hodId = id;

    // ✅ Find the HOD by ID and validate role
    const hod = await teacherSchema.findById(hodId);
    if (!hod || hod.role !== 'hod') {
      return NextResponse.json({
        error: 'HOD not found or invalid role'
      }, {
        status: 404
      });
    }

    const department = hod.department;

    // ✅ Get all academic data for the department
    const academics = await academicSchema.find({ department })

    return NextResponse.json({
      message: 'Academic data fetched successfully',
      department,
      academics,
    }, {
      status: 200
    });

  } catch (error) {
    console.error('Error fetching academic data for HOD:', error);
    return NextResponse.json({
      error: 'Internal Server Error'
    }, {
      status: 500
    });
  }
}

// POST route handler so that hod can add functions yr, subjects, division

export async function POST(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = params;
    const { academicId, years } = await request.json();
    console.log(academicId, years)
    // Validate input
    if (!academicId || !Array.isArray(years) || years.length === 0) {
      return NextResponse.json(
        { error: 'academicId and at least one year object are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(academicId)) {
      return NextResponse.json({ error: 'Invalid academicId' }, { status: 400 });
    }

    const hod = await teacherSchema.findById(id);
    if (!hod || hod.role !== 'hod') {
      return NextResponse.json({ error: 'Unauthorized: Not an HOD' }, { status: 403 });
    }

    const academic = await academicSchema.findById(academicId);
    if (!academic) {
      return NextResponse.json({ error: 'Academic record not found' }, { status: 404 });
    }

    if (hod.department !== academic.department) {
      return NextResponse.json({ error: 'HOD is not assigned to this department' }, { status: 403 });
    }

    // Loop through each year object
    for (const yearObj of years) {
      if (!yearObj.year || !yearObj.semester || !Array.isArray(yearObj.divisions)) {
        return NextResponse.json(
          { error: 'Each year object must include year, semester, and divisions array' },
          { status: 400 }
        );
      }

      const newYear = {
        year: yearObj.year,
        semester: yearObj.semester,
        divisions: [],
      };

      for (const division of yearObj.divisions) {
        if (!division.name || !division.subjects || !division.timetable || !division.exams) {
          return NextResponse.json(
            { error: 'Each division must include name, subjects, timetable, and exams' },
            { status: 400 }
          );
        }

        // Validate subjects
        for (const subject of division.subjects) {
          if (!subject.name || !subject.teacher) {
            return NextResponse.json({ error: 'Each subject must have name and teacher' }, { status: 400 });
          }

          const teacher = await teacherSchema.findById(subject.teacher);
          if (!teacher || teacher.role !== 'teacher') {
            return NextResponse.json({ error: `Invalid teacher ID: ${subject.teacher}` }, { status: 400 });
          }
        }

        // Validate timetable
        for (const slot of division.timetable) {
          if (!slot.day || !slot.period || !slot.subject || !slot.teacher || !slot.time?.start || !slot.time?.end) {
            return NextResponse.json({ error: 'Timetable slot missing required fields' }, { status: 400 });
          }

          const teacher = await teacherSchema.findById(slot.teacher);
          if (!teacher || teacher.role !== 'teacher') {
            return NextResponse.json({ error: `Invalid timetable teacher ID: ${slot.teacher}` }, { status: 400 });
          }
        }

        // Validate exams
        for (const exam of division.exams) {
          if (!exam.type || !exam.subject || !exam.totalMarks || !exam.date || !exam.duration) {
            return NextResponse.json({ error: 'Each exam must have type, subject, totalMarks, duration,and date' }, { status: 400 });
          }
        }

        // Validate optional students
        if (division.students && Array.isArray(division.students)) {
          if (division.students.length > 50) {
            return NextResponse.json({ error: 'A division cannot have more than 50 students' }, { status: 400 });
          }

          for (const studentId of division.students) {
            const student = await userSchema.findById(studentId);
            if (!student || student.role !== 'student') {
              return NextResponse.json({ error: `Invalid student ID: ${studentId}` }, { status: 400 });
            }
          }
        }

        // Push the division to newYear
        newYear.divisions.push({
          name: division.name,
          students: division.students || [],
          subjects: division.subjects,
          timetable: division.timetable,
          exams: division.exams,
          attendance: division.attendance || [],
        });
      }

      // Push the year with semester into academic.years
      academic.years.push(newYear);
    }

    await academic.save();

    return NextResponse.json(
      { message: 'Years, semesters, and divisions added successfully', academic },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in POST /api/hod/[id]/academics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

//PUT route handler for HOD to update academics details 

//PUT route handler for HOD to update academics details 
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const { id: hodId } = params;
    const { academicId, years } = await request.json();
    console.log(academicId, years);

    // Validate input
    if (!academicId || !Array.isArray(years)) {
      return NextResponse.json(
        { error: 'academicId and years array are required' },
        { status: 400 }
      );
    }

    // Verify HOD
    const hod = await teacherSchema.findById(hodId);
    if (!hod || hod.role !== 'hod') {
      return NextResponse.json(
        { error: 'Unauthorized: Not a valid HOD' },
        { status: 403 }
      );
    }

    // Find academic record
    const academic = await academicSchema.findById(academicId);
    if (!academic) {
      return NextResponse.json(
        { error: 'Academic record not found' },
        { status: 404 }
      );
    }

    // Check HOD belongs to same department
    if (academic.department !== hod.department) {
      return NextResponse.json(
        { error: 'HOD not authorized for this department' },
        { status: 403 }
      );
    }

    // Validate each year object
    for (const yearObj of years) {
      if (!yearObj.year || !yearObj.semester) {
        return NextResponse.json(
          { error: 'Each year object must include year and semester' },
          { status: 400 }
        );
      }

      // Validate divisions if they exist
      if (yearObj.divisions && Array.isArray(yearObj.divisions)) {
        for (const division of yearObj.divisions) {
          // Add your division validation logic here if needed
        }
      }
    }

    // Preserve required fields that might be missing in the update
    const updatedAcademic = {
      ...academic.toObject(),
      years,
      programType: academic.programType, // Make sure programType is preserved
      department: academic.department,   // Preserve department
    };

    // Use findByIdAndUpdate to properly handle the update
    const result = await academicSchema.findByIdAndUpdate(
      academicId,
      updatedAcademic,
      { new: true }
    );

    return NextResponse.json(
      {
        message: 'Years with semesters updated successfully',
        updated: result
      },
      {
        status: 200
      }
    );
  } catch (error) {
    console.error('Error updating years:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

//delete handler to delete academics

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const { id: hodId } = params;
    const { academicId, year, semester } = await request.json();

    // Validate academicId, year, and semester
    if (
      !academicId ||
      !mongoose.Types.ObjectId.isValid(academicId) ||
      !year ||
      !semester
    ) {
      return NextResponse.json(
        { error: 'academicId, year, and semester are required' },
        { status: 400 }
      );
    }

    // ✅ Verify HOD
    const hod = await teacherSchema.findById(hodId);
    if (!hod || hod.role !== 'hod') {
      return NextResponse.json(
        { error: 'Unauthorized: Not a valid HOD' },
        { status: 403 }
      );
    }

    // ✅ Find academic record
    const academic = await academicSchema.findById(academicId);
    if (!academic) {
      return NextResponse.json(
        { error: 'Academic record not found' },
        { status: 404 }
      );
    }

    // ✅ Check HOD belongs to same department
    if (academic.department !== hod.department) {
      return NextResponse.json(
        { error: 'HOD not authorized for this department' },
        { status: 403 }
      );
    }

    // ✅ Remove the year+semester object from years array
    const originalLength = academic.years.length;
    academic.years = academic.years.filter(
      (y) => !(y.year === year && y.semester === semester)
    );

    if (academic.years.length === originalLength) {
      return NextResponse.json(
        { error: 'No matching year and semester found to delete' },
        { status: 404 }
      );
    }

    await academic.save();

    return NextResponse.json(
      {
        message: `Year "${year}" Semester "${semester}" removed successfully`,
        updated: academic
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/hod/[id]/academics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}