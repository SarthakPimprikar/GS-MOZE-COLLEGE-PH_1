import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import academic from "@/app/models/academicSchema";

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { type, subject, totalMarks, date, duration, year, semester, division, teacherId, resultPublished } = body;

    console.log(type, subject, totalMarks, date, duration, year, semester, division, resultPublished);
    console.log("teacher id ", teacherId);

    // Validate required fields
    if (!type || !subject || !totalMarks || !date || !duration || !year || !semester || !division) {
      return NextResponse.json(
        { error: "All fields are required: type, subject, totalMarks, date, duration, year, semester, division" },
        { status: 400 },
      );
    }

    // Find the academic record and the specific division
    const academicRecord = await academic.findOne({
  years: {
    $elemMatch: {
      year,
      semester,
      divisions: {
        $elemMatch: {
          name: division,
          "subjects.teacher": teacherId,
        },
      },
    },
  },
});


    console.log(academicRecord);

    if (!academicRecord) {
      return NextResponse.json(
        { error: "Academic record not found or teacher not authorized for this division" },
        { status: 404 },
      );
    }

    // Create new exam object
    const newExam = {
      type,
      subject,
      totalMarks: Number.parseInt(totalMarks),
      date: new Date(date),
      duration: Number.parseInt(duration),
      resultPublished: resultPublished || false, // Default to false if not provided
      result: [], // Initialize empty result array
    };

    // Find the correct year, semester, and division to add the exam
    const yearIndex = academicRecord.years.findIndex((y) => y.year === year && y.semester === semester);
    const divisionIndex = academicRecord.years[yearIndex].divisions.findIndex((d) => d.name === division);

    // Add the exam to the division
    academicRecord.years[yearIndex].divisions[divisionIndex].exams.push(newExam);

    // Save the updated academic record
    await academicRecord.save();

    // Get the newly created exam (last one in the array)
    const createdExam =
      academicRecord.years[yearIndex].divisions[divisionIndex].exams[
        academicRecord.years[yearIndex].divisions[divisionIndex].exams.length - 1
      ];

    return NextResponse.json(
      {
        message: "Exam created successfully",
        exam: {
          id: createdExam._id,
          type: createdExam.type,
          subject: createdExam.subject,
          totalMarks: createdExam.totalMarks,
          date: createdExam.date,
          duration: createdExam.duration,
          resultPublished: createdExam.resultPublished,
          questionCount: 0, // New exam starts with 0 questions
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating exam:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}