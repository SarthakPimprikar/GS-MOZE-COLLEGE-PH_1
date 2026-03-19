//get api to fetch student data through admission id from 

// api/student/[id]/admission/route.js


import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import admissionSchema from '../../../../models/admissionSchema';
import studentSchema from '../../../../models/studentSchema';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    // 1. Grab the studentId from the dynamic segment
    const { id: studentId } = await params;

    // 2. Find the student to get the admissionId
    const student = await studentSchema.findById(studentId).lean();
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    if (!student.admissionId) {
      return NextResponse.json(
        { success: false, message: "No admission record linked to this student" },
        { status: 404 }
      );
    }

    // 3. Fetch the full admission document
    const admission = await admissionSchema
      .findById(student.admissionId)
      //.populate("enquiryId")   // optional: if you want enquiry details
      .lean();

    if (!admission) {
      return NextResponse.json(
        { success: false, message: "Admission record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, admission }, { status: 200 });
  } catch (error) {
    console.error("Admission GET error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}