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
      "years.year": year,
      "years.semester": semester,
      "years.divisions.name": division,
      "years.divisions.subjects.teacher": teacherId,
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
      resultPublished: resultPublished || false,
      result: [],
    };

    // Find the correct year, semester, and division to add the exam
    const yearIndex = academicRecord.years.findIndex((y) => y.year === year && y.semester === semester);
    const divisionIndex = academicRecord.years[yearIndex].divisions.findIndex((d) => d.name === division);

    // Add the exam to the division
    academicRecord.years[yearIndex].divisions[divisionIndex].exams.push(newExam);

    // Save the updated academic record
    await academicRecord.save();

    // Get the newly created exam
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
          questionCount: 0,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating exam:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const {id} = await params;
    const teacherId = id;
    const {examId} = await params;
    const { resultPublished } = await request.json();

    console.log("PUT request - Teacher ID:", teacherId, "Exam ID:", examId, "resultPublished:", resultPublished);

    if (typeof resultPublished !== "boolean") {
      return NextResponse.json(
        { error: "resultPublished must be a boolean value" },
        { status: 400 }
      );
    }

    // Update only the specific exam's resultPublished field
    const updateResult = await academic.updateOne(
      {
        "years.divisions.exams._id": examId,
        "years.divisions.subjects.teacher": teacherId,
      },
      {
        $set: {
          "years.$[].divisions.$[].exams.$[exam].resultPublished": resultPublished,
        },
      },
      {
        arrayFilters: [{ "exam._id": examId }],
      }
    );

    if (updateResult.matchedCount === 0) {
      console.log("No academic record found for exam ID:", examId, "and teacher ID:", teacherId);
      return NextResponse.json(
        { error: "Exam not found or teacher not authorized" },
        { status: 404 }
      );
    }

    // Fetch the updated exam to return its details
    const updatedRecord = await academic.findOne({
      "years.divisions.exams._id": examId,
    });

    let updatedExam = null;
    updatedRecord.years.forEach((year) => {
      year.divisions.forEach((division) => {
        const exam = division.exams.find((e) => e._id.toString() === examId);
        if (exam) {
          updatedExam = exam;
        }
      });
    });

    if (!updatedExam) {
      console.log("Exam not found in any division");
      return NextResponse.json(
        { error: "Exam not found" },
        { status: 404 }
      );
    }

    console.log("Exam updated successfully:", updatedExam);

    return NextResponse.json(
      {
        message: "Exam updated successfully",
        exam: {
          id: updatedExam._id,
          type: updatedExam.type,
          subject: updatedExam.subject,
          totalMarks: updatedExam.totalMarks,
          date: updatedExam.date,
          duration: updatedExam.duration,
          resultPublished: updatedExam.resultPublished,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating exam:", error);
    return NextResponse.json(
      { error: `Failed to update exam: ${error.message}` },
      { status: 500 }
    );
  }
}