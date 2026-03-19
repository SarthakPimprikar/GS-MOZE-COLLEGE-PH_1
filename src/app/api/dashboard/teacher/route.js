import { connectToDatabase } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

import Student from "@/app/models/studentSchema";
import Academic from "@/app/models/academicSchema";

export async function GET() {
  try {
    await connectToDatabase(); // this ensures mongoose is connected

    const [studentsCount, activeCourseCount, pendingAssignments, averageGrade] =
      await Promise.all([
        Student.countDocuments(),
        Academic.countDocuments({ isActive: true }),
      ]);
    const academicRecords = await Academic.find({ isActive: true })
      .populate({
        path: "years.divisions.exams.result.student",
        select: "name", // Only get the student name if needed
      })
      .populate({
        path: "years.divisions.subjects.teacher",
        select: "name", // Teacher name if needed
      });

      
    return NextResponse.json({
      students: studentsCount,
      activeCourse: activeCourseCount,
      ac: academicRecords
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { message: "Failed to fetch dashboard data", error: error.message },
      { status: 500 }
    );
  }
}

// import { connectToDatabase } from '@/app/lib/mongodb';
// import { NextResponse } from 'next/server';
// import Academic from '@/app/models/academicSchema';

// export async function GET() {
//   try {
//     await connectToDatabase();

//     // Fetch all academic records that are active
//     const academicRecords = await Academic.find({ isActive: true })
//       .populate({
//         path: 'years.divisions.exams.result.student',
//         select: 'name', // Only get the student name if needed
//       })
//       .populate({
//         path: 'years.divisions.subjects.teacher',
//         select: 'name', // Teacher name if needed
//       });

//     // Process the data to extract classes and calculate average grades
//     const classesWithGrades = [];

//     academicRecords.forEach(academic => {
//       academic.years.forEach(year => {
//         year.divisions.forEach(division => {
//           let totalMarks = 0;
//           let totalExams = 0;
//           let studentCount = 0;
//           const studentGrades = {};

//           // Calculate average grades for each student in the division
//           division.exams.forEach(exam => {
//             exam.result.forEach(result => {
//               if (result.marks !== null) {
//                 if (!studentGrades[result.student._id]) {
//                   studentGrades[result.student._id] = {
//                     total: 0,
//                     count: 0
//                   };
//                 }
//                 studentGrades[result.student._id].total += result.marks;
//                 studentGrades[result.student._id].count += 1;
//               }
//             });
//           });

//           // Calculate class average
//           const studentAverages = Object.values(studentGrades).map(s => s.total / s.count);
//           const classAverage = studentAverages.length > 0
//             ? studentAverages.reduce((a, b) => a + b, 0) / studentAverages.length
//             : 0;

//           classesWithGrades.push({
//             department: academic.department,
//             year: year.year,
//             semester: year.semester,
//             division: division.name,
//             studentCount: division.students.length,
//             classAverage: parseFloat(classAverage.toFixed(2)), // Round to 2 decimal places
//             subjects: division.subjects.map(sub => ({
//               code: division.code,
//               name: sub.name,
//             })),
//             programType: academic.programType
//           });
//         });
//       });
//     });

//     return NextResponse.json({
//       success: true,
//       data: classesWithGrades
//     });

//   } catch (error) {
//     console.error('Error fetching classes and grades:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: 'Failed to fetch classes and grades',
//         error: error.message
//       },
//       { status: 500 }
//     );
//   }
// }
