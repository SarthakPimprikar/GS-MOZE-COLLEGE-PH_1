
// import Academic from "../../../../../models/academicSchema";
import { connectToDatabase } from "../../../../../lib/mongodb"
import { NextResponse } from "next/server";
import attendanceSchema from "@/app/models/attendanceSchema";

// POST /api/teachers/[id]/dashboard/attendance
export async function POST(req, { params }) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const {
      date,
      department,
      year,
      division,
      semester,
      subject,
      topic,
      attendanceRecords,
      courseId,
      teacherId,
    } = body;

    const attendance = new attendanceSchema({
      date,
      department,
      year,
      semester,
      division,
      subject,
      topic,
      attendanceRecords,
      courseId,
      teacherId,
    });

    const saved = await attendance.save();
    return NextResponse.json({ message: "Attendance recorded", attendance: saved }, { status: 201 });

  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
  }
}

// export async function GET() {
//     try {
//     await connectToDatabase();
//     const academics = await Academic.find({ isActive: true });
//     const subjects = [];
    
//     academics.forEach(academic => {
//       academic.years.forEach(year => {
//         year.divisions.forEach(division => {
//           division.subjects.forEach(subject => {
//             subjects.push({
//               department: academic.department,
//               year: year.year,
//               semester: year.semester,
//               division: division.name,
//               code: subject.code,
//               name: subject.name,
//               teacher: subject.teacher,
//               id: subject._id
//             });
//           });
//         });
//       });
//     });
    
//     return NextResponse.json({ subjects });
    
//   } catch (error) {
//     console.error('Error fetching Subject data:', error);
//     return NextResponse.json(
//       { error: "Failed to fetch academic data" },
//       { status: 500 }
//     );
//   }
// }