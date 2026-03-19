import { connectToDatabase } from '@/lib/mongoose';
import Admission from '@/app/models/admissionSchema';
import Student from '@/app/models/studentSchema';
import User from '@/app/models/userSchema';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const {id} = await params;
    const admissionId = id; // Get id directly from params
    const updateData = await req.json();

    if (!updateData || typeof updateData !== 'object' || Object.keys(updateData).length === 0) {
      return Response.json(
        { success: false, message: "Missing or invalid update data" },
        { status: 400 }
      );
    }

    // Prevent updating certain fields
    const restrictedFields = ['_id', 'enquiryId', 'counsellorId', 'createdAt'];
    for (const field of restrictedFields) {
      if (field in updateData) {
        delete updateData[field];
      }
    }

    // Update admission record
    const updatedAdmission = await Admission
      .findByIdAndUpdate(
        admissionId,
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .lean();

    if (!updatedAdmission) {
      return Response.json(
        { success: false, message: 'Admission not found' },
        { status: 404 }
      );
    }

    // Check if status is being changed to 'approved' and trigger automatic conversion
    let conversionResult = null;
    if (updateData.status === 'approved') {
      console.log(` Status changed to approved, triggering automatic conversion for admission: ${admissionId}`);
      
      try {
        conversionResult = await convertAdmissionToStudent(updatedAdmission);
        console.log(` Automatic conversion successful for admission: ${admissionId}`);
      } catch (conversionError) {
        console.error(` Automatic conversion failed for admission: ${admissionId}`, conversionError);
        conversionResult = {
          success: false,
          error: conversionError.message
        };
      }
    }

    return Response.json(
      {
        success: true,
        message: 'Admission updated successfully',
        data: updatedAdmission,
        conversionResult: conversionResult
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Admission PUT error:', error);
    
    if (error.name === 'ValidationError') {
      return Response.json(
        { 
          success: false,
          message: 'Validation failed',
          errors: Object.values(error.errors).map(err => err.message)
        },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return Response.json(
        { 
          success: false,
          message: 'Duplicate value error',
          field: Object.keys(error.keyPattern)[0]
        },
        { status: 409 }
      );
    }

    return Response.json(
      {
        success: false,
        message: 'Server error during update',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Helper function to convert admission to student
async function convertAdmissionToStudent(admission) {
  console.log(`🔄 Starting conversion for admission: ${admission._id}`);
  
  // Check if already converted to student
  const existingStudent = await Student.findOne({ admissionId: admission._id });
  if (existingStudent) {
    throw new Error("Admission already converted to student");
  }

  // 1. Generate Unique Student ID
  let studentId;
  let isUnique = false;
  let attempts = 0;
  
  while (!isUnique && attempts < 10) {
    const yearSuffix = new Date().getFullYear().toString().slice(-2);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    studentId = `STU${yearSuffix}${randomSuffix}`;
    
    const existingStudent = await Student.findOne({ studentId: studentId });
    const existingUser = await User.findOne({ username: studentId });
    
    if (!existingStudent && !existingUser) {
      isUnique = true;
    }
    attempts++;
  }
  
  if (!isUnique) {
    throw new Error("Unable to generate unique student ID");
  }

  // 2. Generate Unique PRN
  let prn;
  let isPrnUnique = false;
  let prnAttempts = 0;
  
  while (!isPrnUnique && prnAttempts < 50) {
    const yearSuffix = new Date().getFullYear().toString().slice(-2);
    const timestamp = Date.now().toString().slice(-6);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    prn = `PRN${yearSuffix}${timestamp}${randomSuffix}`;
    
    try {
      const existingPrn = await Student.findOne({ prn: prn }).lean().exec();
      
      if (!existingPrn) {
        const doubleCheck = await Student.findOne({ prn: prn }).select('_id').lean().exec();
        if (!doubleCheck) {
          isPrnUnique = true;
          break;
        }
      }
    } catch (findError) {
      console.error("Error checking PRN uniqueness:", findError);
    }
    
    prnAttempts++;
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  if (!isPrnUnique) {
    throw new Error("Unable to generate unique PRN");
  }

  // 3. Check for existing conflicts
  const existingEmailUser = await User.findOne({ email: admission.email });
  const existingEmailStudent = await Student.findOne({ email: admission.email });
  
  if (existingEmailUser || existingEmailStudent) {
    throw new Error("A user with this email already exists");
  }

  // 4. Create Student Profile and User in Transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  
  let newUser, newStudent;
  
  try {
    // Create User Record within transaction
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(studentId, salt);

    newUser = await User.create([{
      fullName: admission.fullName,
      email: admission.email,
      phone: admission.studentWhatsappNumber?.toString() || "",
      role: "student",
      password: hashedPassword,
      username: studentId,
    }], { session });

    // Create Student Profile within transaction
    newStudent = await Student.create([{
      studentId: studentId,
      admissionId: admission._id,
      fullName: admission.fullName,
      email: admission.email,
      mobileNumber: admission.studentWhatsappNumber?.toString() || "",
      dateOfBirth: admission.dateOfBirth ? new Date(admission.dateOfBirth) : new Date(),
      gender: admission.gender,
      address: admission.address && admission.address[0] ? admission.address[0] : {},
      programType: admission.programType,
      branch: admission.branch,
      currentYear: admission.year,
      prn: prn,
      counsellorId: admission.counsellorId,
      status: "active",
      // Mapping missing fields
      feesCategory: admission.feesCategory,
      casteAsPerLC: admission.casteAsPerLC,
      subCasteAsPerLC: admission.subCasteAsPerLC,
      domicile: admission.domicile,
      nationality: admission.nationality,
      religionAsPerLC: admission.religionAsPerLC,
      isForeignNational: admission.isForeignNational,
      motherName: admission.motherName,
      familyIncome: admission.familyIncome,
      fatherGuardianWhatsappNumber: admission.fatherGuardianWhatsappNumber?.toString() || "",
      motherMobileNumber: admission.motherMobileNumber?.toString() || "",
      seatType: admission.seatType,
      admissionCategoryDTE: admission.admissionCategoryDTE,
      quota: admission.quota,
      admissionYear: admission.admissionYear,
      round: admission.round,
      admissionType: admission.admissionType,
      dteApplicationNumber: admission.dteApplicationNumber,
      totalFees: admission.totalFees
    }], { session });

    // Update Admission Status within transaction
    await Admission.findByIdAndUpdate(admission._id, {
      status: "approved",
      prn: prn,
      isPrnGenerated: true
    }, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    
    return {
      success: true,
      studentId: studentId,
      prn: prn,
      userId: newUser[0]._id
    };

  } catch (transactionError) {
    // Abort the transaction on any error
    await session.abortTransaction();
    session.endSession();
    
    console.error("Transaction failed:", transactionError);
    
    // Handle duplicate key errors specifically
    if (transactionError.code === 11000) {
      const field = Object.keys(transactionError.keyPattern || transactionError.keyValue || {})[0] || 'unknown';
      throw new Error(`A record with this ${field} already exists. Please try again.`);
    }
    
    throw new Error(`Failed to create student profile: ${transactionError.message}`);
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id: admissionId } = params;

    // Validate admission ID
    if (!mongoose.Types.ObjectId.isValid(admissionId)) {
      return Response.json(
        { success: false, message: "Invalid admission ID format" },
        { status: 400 }
      );
    }

    // Check for existing student record
    const existingStudent = await Student.findOne({ admissionId });
    if (existingStudent) {
      return Response.json(
        {
          success: false,
          message: "Cannot delete admission - student record exists",
          studentId: existingStudent.studentId,
        },
        { status: 400 }
      );
    }

    // Perform deletion
    const deletedAdmission = await Admission.findByIdAndDelete(
      admissionId
    );

    if (!deletedAdmission) {
      return Response.json(
        { success: false, message: "Admission not found" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Admission deleted successfully",
        data: {
          _id: deletedAdmission._id,
          fullName: deletedAdmission.fullName,
          status: deletedAdmission.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admission DELETE error:", error);
    return Response.json(
      {
        success: false,
        message: "Server error during deletion",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const {id}  = params;

    console.log("From ID page",id);
    
    const admission = await Admission.findById(id);
    if (!admission) {
      return NextResponse.json(
        { success: false, error: "Admission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: admission });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
