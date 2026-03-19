import { connectToDatabase } from "../../../../lib/mongodb"
import academicSchema from "../../../../models/academicSchema"
import studentSchema from "../../../../models/studentSchema"
import { NextResponse } from "next/server"

// GET /api/teachers/[id]/students
export async function GET(req, { params }) {
  await connectToDatabase()

  try {
    const {id} = await params;
    const teacherId = id
    const { searchParams } = new URL(req.url)
    const divisionFilter = searchParams.get("division")
    const yearFilter = searchParams.get("year")
    const semesterFilter = searchParams.get("semester")

    const academicRecords = await academicSchema
      .find({
        "years.divisions.subjects.teacher": teacherId,
      })
      .populate({
        path: "years.divisions.students",
        model: studentSchema,
        select: "fullName email prn studentId division status mobileNumber programType",
      })

    if (!academicRecords || academicRecords.length === 0) {
      return NextResponse.json({ message: "No students found for this teacher" }, { status: 404 })
    }
    // console.log("Acaded = ",academicRecords)
    const studentsByTeacher = []

    academicRecords.forEach((program) => {
      program.years.forEach((year) => {
        if (yearFilter && year.year !== yearFilter) {
          return
        }

        if (semesterFilter && year.semester !== semesterFilter) {
          return
        }
        
        year.divisions.forEach((division) => {
          const subjectsTaught = division.subjects.filter((subject) => subject.teacher.toString() === teacherId)

          if (subjectsTaught.length > 0) {
            division.students.forEach((student) => {
              if (!divisionFilter || division.name === divisionFilter) {
                studentsByTeacher.push({
                  id: student._id,
                  studentId: student.studentId,
                  fullName: student.fullName,
                  email: student.email,
                  prn: student.prn,
                  program: program.programType,
                  department: program.department,
                  year: year.year,
                  semester: year.semester,
                  division: division.name,
                  status: student.status,
                  mobileNumber: student.mobileNumber,
                  subjects: subjectsTaught.map((subj) => subj.name),
                })
              }
            })
          }
        })
      })
    })

    if ((divisionFilter || yearFilter || semesterFilter) && studentsByTeacher.length === 0) {
      const filterDesc = [
        yearFilter && `year ${yearFilter}`,
        semesterFilter && `semester ${semesterFilter}`,
        divisionFilter && `division ${divisionFilter}`,
      ]
        .filter(Boolean)
        .join(", ")

      return NextResponse.json({ message: `No students found for ${filterDesc}` }, { status: 404 })
    }

    console.log(studentsByTeacher)

    return NextResponse.json(
      {
        message: "Students fetched successfully",
        students: studentsByTeacher,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("GET error:", error)
    return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 })
  }
}
