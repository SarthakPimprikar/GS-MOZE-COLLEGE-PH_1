// app/api/students/myexams/[id]/route.js
import { NextResponse } from "next/server"
import Exam from "@/app/models/questionAndAnswer"
import { connectToDatabase } from "@/app/lib/mongodb"
import Academic from "@/app/models/academicSchema"

export async function GET(request, { params }) {
  try {
    await connectToDatabase()
    const { id } = params

    // Find the exam with questions but exclude correct answers
    const exam = await Exam.find({ examId: id })
      .populate({
        path: 'question',
        select: '-correctAnswer' // Don't send correct answers to student
      })

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 })
    }

    return NextResponse.json({ exam }, { status: 200 })


  } catch (error) {
    console.error("Error fetching exam:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}

// export async function POST(request, { params }) {
//   try {
//     await connectToDatabase()
    
//     const { id } = params
//     const { answers, studentId } = await request.json()

//     console.log(id , answers , studentId);
    

//     // Validate student ID
//     if (!studentId) {
//       return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
//     }

//     // Find the exam with correct answers for grading
//     const exam = await Exam.find({ examId: id }).populate('question')
//     if (!exam) {
//       return NextResponse.json({ error: "Exam not found" }, { status: 404 })
//     }

//     console.log("Exam Data ",exam);
    
//     // Find the student's academic record
//     const academic = await Academic.findOne({
//       "years.divisions.students": studentId
//     })
    
//     console.log("Academics Data ",academic);
    
//     if (!academic) {
//       return NextResponse.json({ error: "Student academic record not found" }, { status: 404 })
//     }

//     // Find the specific exam in academic record
//     let examRecord = null;
//     let divisionPath = null;
//     let yearIndex = -1;
//     let divisionIndex = -1;
//     let examIndex = -1;

//     // Search through the academic structure to find the exam
//     for (let y = 0; y < academic.years.length; y++) {
//       for (let d = 0; d < academic.years[y].divisions.length; d++) {
//         const division = academic.years[y].divisions[d];
//         if (division.students.includes(studentId)) {
//           for (let e = 0; e < division.exams.length; e++) {
//             if (division.exams[e]._id.toString() === id) {
//               examRecord = division.exams[e];
//               yearIndex = y;
//               divisionIndex = d;
//               examIndex = e;
//               divisionPath = `years.${y}.divisions.${d}.exams.${e}`;
//               break;
//             }
//           }
//         }
//         if (examRecord) break;
//       }
//       if (examRecord) break;
//     }
//     console.log("Exam Record :::::::",examRecord);

//     if (!examRecord) {
//       return NextResponse.json({ error: "Exam record not found in academic data" }, { status: 404 })
//     }

    

//     // Check if student has already taken this exam
//     const existingResult = examRecord.result.find(
//       r => r.student.toString() === studentId
//     )

//     console.log("Existing Result::::::::",existingResult);
    
//     if (existingResult && existingResult.isAttend) {
//       return NextResponse.json(
//         { 
//           error: "You have already taken this exam",
//           score: existingResult.marks,
//           totalMarks: examRecord.totalMarks
//         }, 
//         { status: 400 }
//       )
//     }

//     // Calculate score
//     let score = 0
//     const questionResults = exam.map(question => {
//       const studentAnswer = answers[question._id]
//       const correctOption = question.options.find(option => option.isCorrect)
//       const isCorrect = studentAnswer === correctOption?.text
      
//       console.log("Question:", question._id, "Student Answer:", studentAnswer, "Correct Answer:", correctOption?.text, "Is Correct:", isCorrect)
      
//       if (isCorrect) {
//         score += question.marks
//       }

//       return {
//         question: question._id,
//         studentAnswer,
//         isCorrect,
//         marks: isCorrect ? question.marks : 0
//       }
//     })

//     console.log("QUestions Ans :::::::::::",questionResults);
    

//     // Update the academic record with the exam result
//     const resultUpdate = {
//       student: studentId,
//       marks: score,
//       isAttend: true,
//       submittedAt: new Date()
//     }

//     // Add to results array or update if already exists
//     if (existingResult) {
//       // Update existing result
//       await Academic.updateOne(
//         { 
//           _id: academic._id,
//           [`${divisionPath}.result.student`]: studentId
//         },
//         {
//           $set: {
//             [`${divisionPath}.result.$.marks`]: score,
//             [`${divisionPath}.result.$.isAttend`]: true,
//             [`${divisionPath}.result.$.submittedAt`]: new Date()
//           }
//         }
//       )
//     } else {
//       // Add new result
//       await Academic.updateOne(
//         { _id: academic._id },
//         {
//           $push: {
//             [`${divisionPath}.result`]: resultUpdate
//           }
//         }
//       )
//     }

//     // Create submission record (optional - if you want to keep a separate record)
//     // const submission = {
//     //   exam: id,
//     //   student: studentId,
//     //   answers: questionResults,
//     //   score,
//     //   totalMarks: exam.totalMarks,
//     //   submittedAt: new Date()
//     // }

//     // Save to submissions collection if you have one
//     // await Submission.create(submission)

//     return NextResponse.json(
//       { 
//         message: "Exam submitted successfully", 
//         score,
//         totalMarks: exam.totalMarks,
//         percentage: (score / exam.totalMarks * 100).toFixed(2)
//       },
//       { status: 200 }
//     )

//   } catch (error) {
//     console.error("Error submitting exam:", error)
//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     )
//   }
// }

export async function POST(request, { params }) {
  try {
    await connectToDatabase()
    
    const { id } = params
    const { answers, studentId, autoSubmitted } = await request.json()

    console.log("Exam ID:", id, "Student ID:", studentId)

    // Validate student ID
    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 })
    }

    // Find the student's academic record first
    const academic = await Academic.findOne({
      "years.divisions.students": studentId
    })
    
    if (!academic) {
      return NextResponse.json({ error: "Student academic record not found" }, { status: 404 })
    }

    // Find the specific exam in academic record
    let examRecord = null;
    let divisionPath = null;
    let yearIndex = -1;
    let divisionIndex = -1;
    let examIndex = -1;

    // Search through the academic structure to find the exam
    for (let y = 0; y < academic.years.length; y++) {
      for (let d = 0; d < academic.years[y].divisions.length; d++) {
        const division = academic.years[y].divisions[d];
        if (division.students.includes(studentId)) {
          for (let e = 0; e < division.exams.length; e++) {
            if (division.exams[e]._id.toString() === id) {
              examRecord = division.exams[e];
              yearIndex = y;
              divisionIndex = d;
              examIndex = e;
              divisionPath = `years.${y}.divisions.${d}`;
              break;
            }
          }
        }
        if (examRecord) break;
      }
      if (examRecord) break;
    }

    if (!examRecord) {
      return NextResponse.json({ error: "Exam record not found in academic data" }, { status: 404 })
    }

    // Check if student has already taken this exam
    const existingResult = examRecord.result && examRecord.result.find(
      r => r.student.toString() === studentId
    )
    
    if (existingResult && existingResult.isAttend) {
      return NextResponse.json(
        { 
          error: "You have already taken this exam",
          score: existingResult.marks,
          totalMarks: examRecord.totalMarks
        }, 
        { status: 400 }
      )
    }

    // Find the exam questions for grading
    const examQuestions = await Exam.find({ examId: id }).populate('question')
    if (!examQuestions || examQuestions.length === 0) {
      return NextResponse.json({ error: "Exam questions not found" }, { status: 404 })
    }

    // Calculate score
    let score = 0
    const questionResults = examQuestions.map(question => {
      const studentAnswer = answers[question._id] || answers[question._id.toString()]
      const correctOption = question.options.find(option => option.isCorrect)
      const isCorrect = studentAnswer === correctOption?.text
      
      console.log("Question:", question._id, "Student Answer:", studentAnswer, "Correct Answer:", correctOption?.text, "Is Correct:", isCorrect)
      
      if (isCorrect) {
        score += question.marks || 1 // Default to 1 mark if not specified
      }

      return {
        question: question._id,
        studentAnswer,
        isCorrect,
        marks: isCorrect ? (question.marks || 1) : 0
      }
    })

    // Update the academic record with the exam result
    const resultUpdate = {
      student: studentId,
      marks: score,
      isAttend: true,
      submittedAt: new Date(),
      autoSubmitted: autoSubmitted || false
    }

    // Add to results array
    await Academic.updateOne(
      { _id: academic._id },
      {
        $push: {
          [`${divisionPath}.exams.${examIndex}.result`]: resultUpdate
        }
      }
    )

    return NextResponse.json(
      { 
        message: "Exam submitted successfully", 
        score,
        totalMarks: examRecord.totalMarks,
        percentage: (score / examRecord.totalMarks * 100).toFixed(2)
      },
      { status: 200 }
    )

  } catch (error) {
    console.error("Error submitting exam:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}