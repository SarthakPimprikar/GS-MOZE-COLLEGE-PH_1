import { NextResponse } from "next/server";
import mongoose from "mongoose";
import academicSchema from "@/app/models/academicSchema";
import teacherSchema from "@/app/models/teacherSchema";

import { connectToDatabase } from "@/lib/mongoose";

// export async function PUT(request, { params }) {
//   try {
//     await connectToDatabase();
//     const { id } = params;

//     if (!id) {
//       return NextResponse.json(
//         { error: "Department ID is required" },
//         { status: 400 }
//       );
//     }

//     const { departmentName, hodId, programType, description } = await request.json();

//     // Validate input
//     if (!departmentName || !hodId) {
//       return NextResponse.json(
//         { error: "Department name and HOD ID are required" },
//         { status: 400 }
//       );
//     }

//     // Start transaction
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       // Check if department exists
//       const department = await academicSchema.findById(id).session(session);
//       if (!department) {
//         await session.abortTransaction();
//         session.endSession();
//         return NextResponse.json(
//           { error: "Department not found" },
//           { status: 404 }
//         );
//       }

//       // Check if new HOD exists
//       const newHod = await teacherSchema.findById(hodId).session(session);
//       if (!newHod) {
//         await session.abortTransaction();
//         session.endSession();
//         return NextResponse.json(
//           { error: "Teacher not found" },
//           { status: 404 }
//         );
//       }

//       // Check if new HOD is already a HOD of another department
//       const existingHod = await teacherSchema
//         .findOne({
//           role: "hod",
//           _id: { $ne: hodId }, // Exclude the new HOD from this check
//           department: departmentName,
//         })
//         .session(session);

//       if (existingHod) {
//         await session.abortTransaction();
//         session.endSession();
//         return NextResponse.json(
//           { error: "Another teacher is already HOD of this department" },
//           { status: 400 }
//         );
//       }

//       // Get current HOD if exists
//       const currentHod = await teacherSchema
//         .findOne({
//           department: department.department,
//           role: "hod",
//         })
//         .session(session);

//       // Update department - corrected syntax
//       const updatedDepartment = await academicSchema.findByIdAndUpdate(
//         id,
//         {
//           department: departmentName,
//           description: description,
//           programType: programType
//         },
//         { new: true, session }
//       );

//       // Remove HOD role from current HOD if exists and it's different from new HOD
//       if (currentHod && currentHod._id.toString() !== hodId) {
//         await teacherSchema.findByIdAndUpdate(
//           currentHod._id,
//           {
//             role: "teacher",
//             $pull: { roles: "hod" },
//           },
//           { session }
//         );
//       }

//       // Assign new HOD role (if different from current or if no current HOD)
//       if (!currentHod || currentHod._id.toString() !== hodId) {
//         await teacherSchema.findByIdAndUpdate(
//           hodId,
//           {
//             department: departmentName,
//             role: "hod",
//             $addToSet: { roles: "hod" },
//           },
//           { session }
//         );
//       }

//       await session.commitTransaction();
//       session.endSession();

//       return NextResponse.json(
//         {
//           message: "Department updated successfully",
//           department: updatedDepartment,
//         },
//         { status: 200 }
//       );

//     } catch (err) {
//       await session.abortTransaction();
//       session.endSession();
//       console.error("Transaction error:", err);
//       return NextResponse.json(
//         { error: "Failed to update department: " + err.message },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Error updating department:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    console.log(id);

    if (!id) {
      return NextResponse.json(
        { error: "Department ID is required" },
        { status: 400 }
      );
    }

    const { departmentName, hodId, programType, description, isActive } =
      await request.json();

    console.log(departmentName, hodId, programType, description, isActive);

    // ✅ If it's just isActive toggle

    if (
      departmentName === undefined &&
      hodId === undefined &&
      programType === undefined &&
      description === undefined &&
      isActive !== undefined
    ) {
      const updatedDepartment = await academicSchema.findByIdAndUpdate(
        id,
        { isActive },
        { new: true }
      );
      return NextResponse.json(
        { message: "Department status updated", department: updatedDepartment },
        { status: 200 }
      );
    }

    // ✅ Validate input
    if (!departmentName || !hodId) {
      return NextResponse.json(
        { error: "Department name and HOD ID are required" },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // ✅ Check if department exists
      const department = await academicSchema.findById(id).session(session);
      if (!department) {
        throw new Error("Department not found");
      }

      // ✅ Check if HOD exists
      const newHod = await teacherSchema.findById(hodId).session(session);
      if (!newHod) {
        throw new Error("Teacher not found");
      }

      // ✅ Check if this teacher is already HOD of ANOTHER department
      const hodOfAnotherDept = await academicSchema
        .findOne({
          _id: { $ne: id }, // exclude current department
          hod: hodId, // field storing HOD reference
        })
        .session(session);

      if (hodOfAnotherDept) {
        throw new Error(
          `This teacher is already assigned as HOD of ${hodOfAnotherDept.department}`
        );
      }

      // ✅ Get current HOD (if exists)
      const currentHod = await teacherSchema
        .findOne({
          department: department.department,
          role: "hod",
        })
        .session(session);

      // ✅ Update department
      const updatedDepartment = await academicSchema.findByIdAndUpdate(
        id,
        {
          department: departmentName,
          description,
          programType,
          hod: hodId, // update HOD ref
        },
        { new: true, session }
      );

      // ✅ Remove HOD role from old HOD (if different)
      if (currentHod && currentHod._id.toString() !== hodId) {
        await teacherSchema.findByIdAndUpdate(
          currentHod._id,
          {
            role: "teacher",
            $pull: { roles: "hod" },
          },
          { session }
        );
      }

      // ✅ Assign HOD role to new HOD
      await teacherSchema.findByIdAndUpdate(
        hodId,
        {
          department: departmentName,
          role: "hod",
          $addToSet: { roles: "hod" },
        },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json(
        { message: "HOD updated successfully", department: updatedDepartment },
        { status: 200 }
      );
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { error: err.message || "Failed to update department" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    // Get ID from both params and query for flexibility
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get("id");

    // Use params.id first, fall back to query.id
    const departmentId = id || queryId;

    if (!departmentId) {
      return Response.json(
        { error: "Department ID is required", success: false },
        { status: 400 }
      );
    }

    const department = await academicSchema.findById(departmentId);
    if (!department) {
      return Response.json(
        { error: "Department not found", success: false },
        { status: 404 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Remove HOD role from current HOD
      const hod = await teacherSchema.findOne({
        department: department.department,
        role: "hod",
      });

      if (hod) {
        await teacherSchema.findByIdAndUpdate(
          hod._id,
          { $set: { department: null } },
          { session }
        );
      }

      await academicSchema.findByIdAndDelete(departmentId, { session });
      await session.commitTransaction();

      return Response.json(
        {
          message: "Department deleted successfully",
          success: true,
        },
        { status: 200 }
      );
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Error deleting department:", error);
    return Response.json(
      {
        error: error.message || "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
