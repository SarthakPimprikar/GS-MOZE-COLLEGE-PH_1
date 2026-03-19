// // api for admin to create department and assign HOD

// // src/app/api/department/route.js
// import { NextResponse } from "next/server";
// import mongoose from "mongoose";
// import academicSchema from "../../models/academicSchema";
// import teacherSchema from "../../models/teacherSchema";

// async function connectToDatabase() {
//   if (mongoose.connections[0].readyState) return;
//   await mongoose.connect(process.env.MONGODB_URI);
// }

// export async function POST(request) {
//   try {
//     await connectToDatabase();

//     const { departmentName, hodId } = await request.json();

//     // Validate input
//     if (!departmentName || !hodId) {
//       return NextResponse.json(
//         {
//           error: "Department name and HOD ID are required",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     // Check if department already exists
//     const existingDepartment = await academicSchema.findOne({
//       department: departmentName,
//     });
//     if (existingDepartment) {
//       return NextResponse.json(
//         {
//           error: "Department already exists",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     // Check if HOD exists
//     const teacher = await teacherSchema.findById(hodId);
//     if (!teacher) {
//       return NextResponse.json(
//         {
//           error: "Teacher not found",
//         },
//         {
//           status: 404,
//         }
//       );
//     }

//     // Prevent assigning HOD if already one
//     if (teacher.department && teacher.role === "hod") {
//       return NextResponse.json(
//         {
//           error: "Teacher is already a HOD of another department",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     // Start transaction
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // Create department with empty years array
//       const newDepartment = new academicSchema({
//         department: departmentName,
//         years: [], // Initially empty
//       });

//       await newDepartment.save({ session });

//       // Update teacher role to HOD
//       await teacherSchema.findByIdAndUpdate(
//         hodId,
//         {
//           department: departmentName,
//           role: "hod",
//         },
//         {
//           session,
//         }
//       );

//       await session.commitTransaction();
//       session.endSession();

//       return NextResponse.json(
//         {
//           message: "Department created and HOD assigned successfully",
//           department: {
//             id: newDepartment._id,
//             name: departmentName,
//             hod: {
//               id: teacher._id,
//               name: teacher.fullName,
//               email: teacher.email,
//             },
//           },
//         },
//         {
//           status: 201,
//         }
//       );
//     } catch (err) {
//       await session.abortTransaction();
//       session.endSession();
//       throw err;
//     }
//   } catch (error) {
//     console.error("Error creating department:", error);
//     return NextResponse.json(
//       {
//         error: "Internal server error",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

// export async function GET() {
//   try {
//     await connectToDatabase();

//     // Fetch all departments
//     const departments = await academicSchema.find({});

//     // Enrich each department with HOD info and include `year`
//     const enrichedDepartments = await Promise.all(
//       departments.map(async (dept) => {
//         const hod = await teacherSchema.findOne({
//           department: dept.department,
//           role: "hod",
//         });
//         return {
//           id: dept._id,
//           department: dept.department,
//           year: dept.year || null, // Include year, even if null
//           divisions: dept.divisions || [],
//           isActive: dept.isActive,
//           hod: hod
//             ? {
//                 id: hod._id,
//                 fullName: hod.fullName,
//                 email: hod.email,
//                 teacherId: hod.teacherId,
//               }
//             : null,
//         };
//       })
//     );

//     return NextResponse.json(
//       {
//         departments: enrichedDepartments,
//       },
//       {
//         status: 200,
//       }
//     );
//   } catch (error) {
//     console.error("Error fetching departments:", error);
//     return NextResponse.json(
//       {
//         error: "Internal server error",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import academicSchema from "../../models/academicSchema";
import teacherSchema from "../../models/teacherSchema";
import { connectToDatabase } from "@/lib/mongoose";

export async function POST(request) {
  try {
    await connectToDatabase();

    const { departmentName, programType, hodId, description } =
      await request.json();

    // Validate input
    if (!departmentName || !programType || !hodId) {
      return NextResponse.json(
        { error: "Department name, program type, and HOD ID are required" },
        { status: 400 }
      );
    }

    // Check if department already exists
    const existingDepartment = await academicSchema.findOne({
      department: departmentName,
      hod: null,
      programType : programType
    });
    if (existingDepartment) {
      return NextResponse.json(
        { error: "Department already exists " },
        { status: 400 }
      );
    }

    // Check if HOD exists
    const teacher = await teacherSchema.findById(hodId);
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    // Check if teacher is already a HOD
    const existingHod = await teacherSchema.findOne({
      _id: hodId,
      role: "hod",
      department: ""
    });

    if (existingHod) {
      return NextResponse.json(
        { error: "Teacher is already a HOD of another department" },
        { status: 400 }
      );
    }

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Create new department
      const newDepartment = new academicSchema({
        department: departmentName,
        programType,
        description: description || "",
        years: [], // Initially empty
        divisions: [], // Initially empty
        isActive: true,
      });

      await newDepartment.save({ session });

      // Update teacher to be HOD
      await teacherSchema.findByIdAndUpdate(
        hodId,
        {
          department: departmentName,
          role: "hod",
          $addToSet: { roles: "hod" }, // Add to roles array if not already present
        },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json(
        {
          message: "Department created and HOD assigned successfully",
          department: {
            id: newDepartment._id,
            name: departmentName,
            programType,
            description,
            hod: {
              id: teacher._id,
              name: teacher.fullName,
              email: teacher.email,
            },
          },
        },
        { status: 201 }
      );
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  } catch (error) {
    if (error.name === "ValidationError" && error.errors?.department?.kind === "enum") {
      return NextResponse.json(
        { error: "Enter valid department name" },
        { status: 400 }
      );
    }
    console.error("Error creating department:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    await connectToDatabase();

    // First, fix any HODs with null departments
    const hodsWithNullDepartment = await teacherSchema.find({
      role: "hod",
      department: null
    });

    if (hodsWithNullDepartment.length > 0) {
      for (const hod of hodsWithNullDepartment) {
        const department = await academicSchema.findOne({
          hod: hod._id
        });
        
        if (department) {
          await teacherSchema.findByIdAndUpdate(hod._id, {
            department: department.department
          });
        }
      }
    }

    // Get all HOD teachers (including their department status)
    const hodTeachers = await teacherSchema.find({
      role: "hod"
    }).select('_id fullName email teacherId department');

    // Then proceed with the normal department fetch
    const departments = await academicSchema.aggregate([
      {
        $lookup: {
          from: "teachers",
          let: { departmentName: "$department" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$department", "$$departmentName"] },
                    { $eq: ["$role", "hod"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                fullName: 1,
                email: 1,
                teacherId: 1,
              },
            },
          ],
          as: "hod",
        },
      },
      {
        $addFields: {
          hod: { $arrayElemAt: ["$hod", 0] },
        },
      },
      {
        $project: {
          _id: 1,
          department: 1,
          programType: 1,
          description: 1,
          years: 1,
          divisions: 1,
          isActive: 1,
          hod: 1,
        },
      },
    ]);

    return NextResponse.json(
      { departments, hodTeachers }, // Include hodTeachers in the response
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}