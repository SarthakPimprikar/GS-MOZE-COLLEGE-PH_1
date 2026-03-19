// app/api/students/myexams/route.js
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/app/lib/mongodb"
import Academic from "@/app/models/academicSchema"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('examId');
    const studentId = searchParams.get('studentId');
    
    if (!examId || !studentId) {
      return NextResponse.json(
        { error: "Exam ID and Student ID are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    
    // Find the student's academic record
    const academic = await Academic.findOne({
      "years.divisions.students": studentId
    });

    if (!academic) {
      return NextResponse.json(
        { error: "Academic record not found" },
        { status: 404 }
      );
    }

    // Search for the exam in the academic record
    let examRecord = null;
    let found = false;

    for (let y = 0; y < academic.years.length; y++) {
      for (let d = 0; d < academic.years[y].divisions.length; d++) {
        const division = academic.years[y].divisions[d];
        if (division.students.includes(studentId)) {
          for (let e = 0; e < division.exams.length; e++) {
            if (division.exams[e]._id.toString() === examId) {
              examRecord = division.exams[e];
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }
      if (found) break;
    }

    if (!examRecord) {
      return NextResponse.json(
        { error: "Exam not found" },
        { status: 404 }
      );
    }

    // Check if student has already taken this exam
    const existingResult = examRecord.result && examRecord.result.find(
      r => r.student.toString() === studentId
    );

    if (existingResult && existingResult.isAttend) {
      return NextResponse.json({ 
        alreadyTaken: true, 
        score: existingResult.marks,
        examInfo: {
          totalMarks: examRecord.totalMarks,
          subject: examRecord.subject,
          type: examRecord.type,
          duration: examRecord.duration
        }
      });
    }

    return NextResponse.json({ alreadyTaken: false });
  } catch (error) {
    console.error("Error fetching exam Status:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}