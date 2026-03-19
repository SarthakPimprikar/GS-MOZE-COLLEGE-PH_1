//get route for admin to view individual HODs details

// src/api/hod/[id]/route.js

import { connectToDatabase } from '../../../lib/mongodb';
import teacherSchema from '../../../models/teacherSchema';
import academicSchema from '../../../models/academicSchema';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const {id} = await params;
    const hodId = id;

    // ✅ Find the HOD by ID
    const hod = await teacherSchema.findById(hodId);
    if (!hod || hod.role !== 'hod') {
      return NextResponse.json({
        error: 'HOD not found or invalid role'
      }, {
        status: 404
      });
    }

    const department = hod.department;

    // ✅ Get all teachers from the same department, excluding HODs
    const teachers = await teacherSchema.find({
      department: department,
      role: 'teacher',
    }).select('-password'); // exclude password from response

    // ✅ Get all academic data for the department
    const academics = await academicSchema.find({
      department: department,
    });

    return NextResponse.json({
      message: 'Department data fetched successfully',
      department: department,
      teachers,
      academics,
    }, {
      status: 200
    });

  } catch (error) {
    console.error('Error fetching HOD dashboard data:', error);
    return NextResponse.json({
      error: 'Internal Server Error'
    }, {
      status: 500
    });
  }
}