import { connectToDatabase } from "@/app/lib/mongodb";
import Academic from "@/app/models/academicSchema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const academics = await Academic.find({ isActive: true });
    const subjects = [];
    
    academics.forEach(academic => {
      academic.years.forEach(year => {
        year.divisions.forEach(division => {
          division.subjects.forEach(subject => {
            subjects.push({
              department: academic.department,
              year: year.year,
              semester: year.semester,
              division: division.name,
              code: subject.code,
              name: subject.name,
              teacher: subject.teacher,
              id: subject._id
            });
          });
        });
      });
    });
    
    return NextResponse.json({ subjects });
    
  } catch (error) {
    console.error('Error fetching Subject data:', error);
    return NextResponse.json(
      { error: "Failed to fetch academic data" },
      { status: 500 }
    );
  }
}

// export async function GET(request) {
//   try {
//     await connectToDatabase();
    
//     const { searchParams } = new URL(request.url);
//     const department = searchParams.get('department');
//     const year = searchParams.get('year');
//     const semester = searchParams.get('semester');
    
//     // Build query object
//     const query = { isActive: true };
//     if (department) query.department = department;
    
//     const academics = await Academic.find(query);
    
//     const subjects = [];
    
//     academics.forEach(academic => {
//       academic.years.forEach(y => {
//         // Apply year filter if provided
//         if (year && y.year !== year) return;
//         // Apply semester filter if provided
//         if (semester && y.semester !== semester) return;
        
//         y.divisions.forEach(division => {
//           division.subjects.forEach(subject => {
//             subjects.push({
//               department: academic.department,
//               year: y.year,
//               semester: y.semester,
//               division: division.name,
//               code: subject.code,
//               name: subject.name,
//               teacher: subject.teacher
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