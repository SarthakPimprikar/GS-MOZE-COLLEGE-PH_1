
import { connectToDatabase } from "@/app/lib/mongodb";
import Academic from "@/app/models/academicSchema";

export async function POST(request) {
  try {
    await connectToDatabase();

    const { 
      department, 
      year, 
      semester, 
      division, 
      subject, 
      examId,
      students 
    } = await request.json();
     console.log("year", year);
     console.log("semester", semester);
     console.log("division", division);
     console.log("examId", examId);
     console.log("subject", subject);
     console.log("students", students);
    // Validate required fields
    if (!department || !year || !semester || !division || !subject || !examId || !students) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Missing required fields' 
      }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
 
   

    // Find the academic document
    const academicDoc = await Academic.findOne({ 
      department,
      isActive: true,
      "years.year": year,
      "years.semester": semester,
      "years.divisions.name": division
    });

    if (!academicDoc) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Academic record not found' 
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    // Prepare the update operation - this will only update results for existing exams
    const updateResult = await Academic.findOneAndUpdate(
      { 
        _id: academicDoc._id,
        "years.year": year,
        "years.semester": semester,
        "years.divisions.name": division,
        "years.divisions.exams._id": examId,
        "years.divisions.exams.subject": subject
      },
      {
        $set: {
          "years.$[y].divisions.$[d].exams.$[e].result": students.map(s => ({
            student: s.studentId,
            marks: s.marks
          }))
        }
      },
      {
        arrayFilters: [
          { "y.year": year },
          { "d.name": division },
          { "e._id": examId }
        ],
        new: true
      }
    );

    if (!updateResult) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Exam not found in the specified division' 
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Marks updated successfully',
      data: {
        department,
        year,
        semester,
        division,
        examId,
        studentsUpdated: students.length
      }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Error updating marks:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: 'Internal server error',
      details: error.message 
    }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}