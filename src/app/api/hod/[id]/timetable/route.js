// import { connectToDatabase } from "@/app/lib/mongodb";
// import Academic from "@/app/models/academicSchema";
// import Teacher from "@/app/models/teacherSchema";
// import CoursePlan from "@/app/models/coursePlanSchema";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await connectToDatabase();

//     // Fetch all active academics

//     const academics = await Academic.find({ isActive: true }).lean();

//     const subjects = [];

//     for (const academic of academics) {
//       for (const year of academic.years) {
//         for (const division of year.divisions) {
//           for (const subject of division.subjects) {
//             // Fetch teacher info

//             const teacher = await Teacher.findById(subject.teacher).lean();

//             // Fetch course plan linked to this subject

//             const coursePlan = await CoursePlan.findOne({
//               subject: subject._id,
//             }).lean();

//             subjects.push({
//               id: subject._id,
//               code: subject.code,
//               name: subject.name,
//               department: academic.department,
//               year: year.year,
//               semester: year.semester,
//               division: division.name,
//               teacher: teacher || null, // Full teacher info
//               coursePlan: coursePlan || null, // Course plan if exists
//             });
//           }
//         }
//       }
//     }

//     return NextResponse.json({ subjects }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching subjects with details:", error);

//     return NextResponse.json(
//       { error: "Failed to fetch subjects with teacher & course plan" },

//       { status: 500 }
//     );
//   }
// }

import { connectToDatabase } from "@/app/lib/mongodb";
import Academic from "@/app/models/academicSchema";
import Teacher from "@/app/models/teacherSchema";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const semester = searchParams.get("semester");
    const division = searchParams.get("division");

    if (!id || !year || !semester || !division) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // First find the HOD to get their department
    const hod = await Teacher.findById(id);
    if (!hod) {
      return NextResponse.json(
        { error: "HOD not found" },
        { status: 404 }
      );
    }

    // Find the academic document by department
    const academic = await Academic.findOne({
      department: hod.department,
      isActive: true,
    }).lean();

    if (!academic) {
      return NextResponse.json(
        { error: "Academic record not found for this department" },
        { status: 404 }
      );
    }

    // Find the specific year and semester
    const yearData = academic.years.find(
      (y) => y.year === year && y.semester === semester
    );
    if (!yearData) {
      return NextResponse.json(
        { error: "Year or semester not found" },
        { status: 404 }
      );
    }

    // Find the specific division
    const divisionData = yearData.divisions.find((d) => d.name === division);
    if (!divisionData) {
      return NextResponse.json(
        { error: "Division not found" },
        { status: 404 }
      );
    }

    // Check if timetable exists
    if (!divisionData.timetable || divisionData.timetable.length === 0) {
      return NextResponse.json({ 
        timetable: [],
        message: "No timetable found. Please generate a timetable first." 
      }, { status: 200 });
    }

    // Fetch timetable and populate teacher details
    const timetable = divisionData.timetable.map((period) => ({
      day: period.day,
      period: period.period,
      subject: period.subject,
      teacher: period.teacher
        ? {
          _id: period.teacher._id,
          fullName: period.teacher.fullName || "Unknown",
        }
        : null,
      time: {
        start: period.time.start,
        end: period.time.end,
      },
    }));

    return NextResponse.json({ timetable }, { status: 200 });
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return NextResponse.json(
      { error: "Failed to fetch timetable" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { academicId, year, semester, division, timetable } =
      await req.json();

    if (!academicId || !year || !semester || !division || !timetable) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Find the academic document
    const academic = await Academic.findById(academicId);
    if (!academic) {
      return new Response(
        JSON.stringify({ message: "Academic record not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Find the specific year
    const yearData = academic.years.find((y) => y.year === year);
    if (!yearData) {
      return new Response(
        JSON.stringify({ message: "Year not found in academic record" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Find the specific division within the year
    const divisionData = yearData.divisions.find((d) => d.name === division);
    if (!divisionData) {
      return new Response(
        JSON.stringify({ message: "Division not found in the specified year" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update the timetable for the division
    divisionData.timetable = timetable;

    // Save the updated document
    await academic.save();

    return new Response(
      JSON.stringify({
        message: "Timetable updated successfully",
        data: academic,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating timetable:", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
