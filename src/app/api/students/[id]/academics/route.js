// import { NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import Academic from '../../../../models/academicSchema';
// import Student from '../../../../models/studentSchema';
// import Teacher from '../../../../models/teacherSchema';
// import Attendance from '../../../../models/attendanceSchema';
// import { connectToDatabase } from '../../../../lib/mongodb';

// export async function GET(request, { params }) {
//   try {
//     const { id } = params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
//     }

//     await connectToDatabase();

//     const studentExists = await Student.findById(id);
//     if (!studentExists) {
//       return NextResponse.json({ error: "Student not found" }, { status: 404 });
//     }

//     const studentObjectId = new mongoose.Types.ObjectId(id);

//     // === Academic Data ===
//     const academicData = await Academic.findOne({
//       "years.divisions.students": studentObjectId,
//     }).lean();

//     let filteredAcademic = null;

//     if (academicData) {
//       let matchedYear = null;
//       let matchedDivision = null;

//       for (const year of academicData.years) {
//         for (const division of year.divisions) {
//           if (division.students.some((stu) => stu.toString() === id)) {
//             matchedYear = {
//               year: year.year,
//               semester: year.semester,
//               divisions: [division],
//               _id: year._id,
//             };
//             matchedDivision = division;
//             break;
//           }
//         }
//         if (matchedYear) break;
//       }

//       if (matchedYear && matchedDivision) {
//         const resolvedSubjects = await Promise.all(
//           matchedDivision.subjects.map(async (subject) => {
//             let teacherName = "Not Assigned";
//             if (subject.teacher) {
//               const teacher = await Teacher.findById(subject.teacher).lean();
//               if (teacher) teacherName = teacher.fullName;
//             }
//             return { ...subject, teacherName };
//           })
//         );

//         const resolvedTimetable = await Promise.all(
//           matchedDivision.timetable.map(async (slot) => {
//             let teacherName = "Not Assigned";
//             if (slot.teacher) {
//               const teacher = await Teacher.findById(slot.teacher).lean();
//               if (teacher) teacherName = teacher.fullName;
//             }
//             return { ...slot, teacherName };
//           })
//         );

//         matchedDivision.subjects = resolvedSubjects;
//         matchedDivision.timetable = resolvedTimetable;

//         filteredAcademic = {
//           _id: academicData._id,
//           department: academicData.department,
//           years: [
//             {
//               ...matchedYear,
//               divisions: [
//                 {
//                   ...matchedDivision,
//                   subjects: resolvedSubjects,
//                   timetable: resolvedTimetable,
//                 },
//               ],
//             },
//           ],
//         };
//       }
//     }

//     // === Attendance Data ===
//     const attendanceRecords = await Attendance.find({
//       "students.studentId": studentObjectId,
      
//     })
//     .populate("teacher", "fullName")
//     .sort({ date: -1 });
    
//     console.log("student Id ",studentObjectId);
//     const attendance = attendanceRecords.map((record) => {
//       const studentEntry = record.students.find(
//         (s) => s.studentId.toString() === id
//       );

//       console.log("Recordddddddddd: ",record);
      
//       return {
//         date: record.date,
//         subject: record.subject,
//         teacherName: record.teacher?.fullName || "N/A",
//         topicName: record.topicName || record.topic || "No topic",
//         isPresent: studentEntry?.isPresent ?? false,
//       };
//     });

//     return NextResponse.json(
//       {
//         academic: filteredAcademic ?? {},
//         attendance,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error", details: error.message },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Academic from '../../../../models/academicSchema';
import Student from '../../../../models/studentSchema';
import Teacher from '../../../../models/teacherSchema';
import Attendance from '../../../../models/attendanceSchema';
import { connectToDatabase } from '../../../../lib/mongodb';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
    }

    await connectToDatabase();

    const studentExists = await Student.findById(id);
    if (!studentExists) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const studentObjectId = new mongoose.Types.ObjectId(id);

    // === Academic Data === (unchanged from your original code)
    const academicData = await Academic.findOne({
      "years.divisions.students": studentObjectId,
    }).lean();

    let filteredAcademic = null;

    if (academicData) {
      let matchedYear = null;
      let matchedDivision = null;

      for (const year of academicData.years) {
        for (const division of year.divisions) {
          if (division.students.some((stu) => stu.toString() === id)) {
            matchedYear = {
              year: year.year,
              semester: year.semester,
              divisions: [division],
              _id: year._id,
            };
            matchedDivision = division;
            break;
          }
        }
        if (matchedYear) break;
      }

      if (matchedYear && matchedDivision) {
        const resolvedSubjects = await Promise.all(
          matchedDivision.subjects.map(async (subject) => {
            let teacherName = "Not Assigned";
            if (subject.teacher) {
              const teacher = await Teacher.findById(subject.teacher).lean();
              if (teacher) teacherName = teacher.fullName;
            }
            return { ...subject, teacherName };
          })
        );

        const resolvedTimetable = await Promise.all(
          matchedDivision.timetable.map(async (slot) => {
            let teacherName = "Not Assigned";
            if (slot.teacher) {
              const teacher = await Teacher.findById(slot.teacher).lean();
              if (teacher) teacherName = teacher.fullName;
            }
            return { ...slot, teacherName };
          })
        );

        matchedDivision.subjects = resolvedSubjects;
        matchedDivision.timetable = resolvedTimetable;

        filteredAcademic = {
          _id: academicData._id,
          department: academicData.department,
          years: [
            {
              ...matchedYear,
              divisions: [
                {
                  ...matchedDivision,
                  subjects: resolvedSubjects,
                  timetable: resolvedTimetable,
                },
              ],
            },
          ],
        };
      }
    }

    // === Updated Attendance Data Fetching ===
    const attendanceRecords = await Attendance.find({
      "attendanceRecords.studentId": studentObjectId,
    })
    .populate("teacherId", "fullName")
    .sort({ date: -1 });

    const attendance = attendanceRecords.map((record) => {
      const studentEntry = record.attendanceRecords.find(
        (s) => s.studentId.toString() === id
      );

      return {
        _id: record._id,
        date: record.date,
        subject: record.subject,
        teacherName: record.teacherId?.fullName || "N/A",
        topic: record.topic || "No topic",
        isPresent: studentEntry?.isPresent || false,
        year: record.year,
        division: record.division,
        department: record.department,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
      };
    });

    return NextResponse.json(
      {
        academic: filteredAcademic ?? {},
        attendance,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}