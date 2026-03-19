// src/app/api/teachers/[id]/dashboard/route.js
//GET handler to fetch teacher data based on id to show on dashboard
import { connectToDatabase } from '../../../lib/mongodb';
import academicSchema from '../../../models/academicSchema';
import teacherSchema from '../../../models/teacherSchema';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        error: 'Invalid or missing teacher ID'
      }, {
        status: 400
      });
    }

    // Fetch teacher details
    const teacher = await teacherSchema.findById(id).select('-password');
    if (!teacher) {
      return NextResponse.json({
        error: 'Teacher not found'
      }, {
        status: 404
      });
    }

    // Fetch all academic records where this teacher is assigned
    const academicRecords = await academicSchema.find({
      'divisions.subjects.teacher': id,
    }).lean();

    const assignments = [];

    for (const record of academicRecords) {
      for (const division of record.divisions) {
        const subjectsTaught = division.subjects.filter(
          (subject) => subject.teacher.toString() === id
        );

        if (subjectsTaught.length > 0) {
          assignments.push({
            year: record.year,
            division: division.name,
            subjects: subjectsTaught.map((s) => s.name),
          });
        }
      }
    }

    return NextResponse.json(
      {
        teacher,
        assignments,
      },
      {
        status: 200
      }
    );

  } catch (error) {
    console.error('Error fetching teacher dashboard:', error);
    return NextResponse.json({
      error: 'Internal Server Error'
    }, {
      status: 500
    });
  }
}


// Added By Chaitanya
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        error: 'Invalid or missing teacher ID'
      }, {
        status: 400
      });
    }

    // Delete teacher from database
    const result = await teacherSchema.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({
        error: 'Teacher not found'
      }, {
        status: 404
      });
    }

    return NextResponse.json({ 
      message: "Teacher deleted successfully",
      deletedId: id
    }, {
      status: 200
    });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json({ 
      error: 'Internal Server Error'
    }, {
      status: 500
    });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const { fullName, email, phone, department, teacherId } = await req.json();
    console.log(fullName,email,phone,department,teacherId);
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({
        error: 'Invalid or missing teacher ID'
      }, {
        status: 400
      });
    }

    // Validation
    if (!fullName || !email || !phone || !teacherId) {
      return NextResponse.json({ 
        error: "All fields are required" 
      }, {
        status: 400
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: "Invalid email format" 
      }, {
        status: 400
      });
    }

    const updateData = {
      fullName,
      email,
      phone,
      department,
      teacherId,
      updatedAt: new Date(),
    };

    // Update teacher in database
    const updatedTeacher = await teacherSchema.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedTeacher) {
      return NextResponse.json({
        error: "Teacher not found"
      }, {
        status: 404
      });
    }

    return NextResponse.json({
      message: "Teacher updated successfully",
      teacher: updatedTeacher
    }, {
      status: 200
    });
  } catch (error) {
    console.error("Error updating teacher:", error);
    return NextResponse.json({ 
      error: 'Internal Server Error'
    }, {
      status: 500
    });
  }
}