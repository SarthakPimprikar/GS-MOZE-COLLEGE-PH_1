

// import { connectToDatabase } from "../../lib/mongodb";
// import admissionSchema from "../../models/admissionSchema";

// export async function POST(req) {
//   try {
//     await connectToDatabase();

//     const body = await req.json();

//     // Destructure all possible fields from the request body
//     const {
//       enquiryId,
//       counsellorId,
//       dteApplicationNumber,
//       admissionYear,
//       email,
//       fullName,
//       nameAsPerAadhar,
//       firstName,
//       middleName,
//       lastName,
//       gender,
//       programType,
//       year,
//       branch,
//       shift,
//       round,
//       quota,
//       seatType,
//       admissionCategoryDTE,
//       feesCategory,
//       admissionType,
//       casteAsPerLC,
//       subCasteAsPerLC,
//       domicile,
//       nationality,
//       religionAsPerLC,
//       isForeignNational,
//       dateOfBirth,
//       motherName,
//       familyIncome,
//       studentWhatsappNumber,
//       fatherGuardianWhatsappNumber,
//       motherMobileNumber,
//       address,
//       documents,
//       status,
//     } = body;
//     console.log(programType)
//     // Validate required fields
//     const requiredFields = {
//       email,
//       fullName,
//       dateOfBirth,
//       gender,
//       nationality,
//       studentWhatsappNumber,
//       programType,
//       year,
//       branch,
//       admissionYear,
//       nameAsPerAadhar,
//       firstName,
//       middleName,
//       lastName,
//       domicile,
//       religionAsPerLC,
//       casteAsPerLC,
//       subCasteAsPerLC,
//       isForeignNational,
//       motherName,
//       fatherGuardianWhatsappNumber,
//       round,
//       quota,
//       seatType,
//       admissionCategoryDTE,
//       feesCategory,
//       admissionType,
//       motherMobileNumber,
//       familyIncome,
//       totalFees,
//       address,
//       documents
//     };

//     for (const [field, value] of Object.entries(requiredFields)) {
//       if (!value || (typeof value === 'boolean' && value !== true)) {
//         return Response.json(
//           { success: false, message: `Missing or invalid required field: ${field}` },
//           { status: 400 }
//         );
//       }
//     }

//     // Create the admission record
//     const newAdmission = new admissionSchema({
//       enquiryId,
//       counsellorId,
//       dteApplicationNumber,
//       admissionYear,
//       email: email.toLowerCase(),
//       fullName,
//       nameAsPerAadhar,
//       firstName,
//       middleName,
//       lastName,
//       gender,
//       programType,
//       year,
//       branch,
//       shift,
//       round,
//       quota,
//       seatType,
//       admissionCategoryDTE,
//       feesCategory,
//       admissionType,
//       casteAsPerLC,
//       subCasteAsPerLC,
//       domicile,
//       nationality,
//       religionAsPerLC,
//       isForeignNational,
//       dateOfBirth,
//       motherName,
//       familyIncome,
//       studentWhatsappNumber,
//       fatherGuardianWhatsappNumber,
//       motherMobileNumber,
//       address,
//       documents,
//       status: status || "inProcess",
//     });

//     await newAdmission.save();

//     return Response.json(
//       {
//         success: true,
//         message: "Admission form submitted successfully",
//         admissionId: newAdmission._id,
//         prn: newAdmission.prn
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Admission POST error:", error);

//     // Handle duplicate key errors (like unique PRN)
//     if (error.code === 11000) {
//       return Response.json(
//         {
//           success: false,
//           message: "Duplicate value error",
//           error: error.message,
//           field: Object.keys(error.keyPattern)[0]
//         },
//         { status: 400 }
//       );
//     }

//     return Response.json(
//       {
//         success: false,
//         message: "Server error",
//         error: error.message
//       },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     await connectToDatabase();

//     // Fetch all admissions with basic details
//     const admissions = await admissionSchema.find({})

//     return Response.json({
//       success: true,
//       count: admissions.length,
//       data: admissions,
//     });
//   } catch (error) {
//     console.error("Error fetching admissions:", error);
//     return Response.json(
//       {
//         success: false,
//         message: "Internal server error",
//         error: error.message
//       },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { connectToDatabase } from "../../lib/mongodb";
import Admission from "../../models/admissionSchema";
import FeeStructure from "../../models/feeStructureSchema";

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();

    // Destructure all possible fields from the request body
    const {
      enquiryId,
      counsellorId,
      dteApplicationNumber,
      admissionYear,
      email,
      fullName,
      nameAsPerAadhar,
      firstName,
      middleName,
      lastName,
      gender,
      programType,
      year,
      branch,
      shift,
      division,
      round,
      quota,
      seatType,
      admissionCategoryDTE,
      feesCategory,
      admissionType,
      casteAsPerLC,
      subCasteAsPerLC,
      domicile,
      nationality,
      religionAsPerLC,
      isForeignNational,
      dateOfBirth,
      motherName,
      familyIncome,
      studentWhatsappNumber,
      fatherGuardianWhatsappNumber,
      motherMobileNumber,
      address,
      details,
      documents,
      status,
      totalFees,
      assignedStaff // Add this
    } = body;

    // ... (validators)

    // Create the admission record
    const newAdmission = new Admission({
      enquiryId,
      counsellorId,
      assignedStaff, // Add this
      dteApplicationNumber,
      admissionYear,
      email: email.toLowerCase(),
      fullName,
      nameAsPerAadhar,
      firstName,
      middleName,
      lastName,
      gender,
      programType,
      year,
      branch,
      shift,
      division,
      round,
      quota,
      seatType,
      admissionCategoryDTE,
      feesCategory,
      totalFees,
      admissionType,
      casteAsPerLC,
      subCasteAsPerLC,
      domicile,
      nationality,
      religionAsPerLC,
      isForeignNational,
      dateOfBirth,
      motherName,
      familyIncome,
      studentWhatsappNumber,
      fatherGuardianWhatsappNumber,
      motherMobileNumber,
      address,
      documents,
      status: status || "inProcess",
    });

    await newAdmission.save();

    console.log("newAdmission",newAdmission);

    return NextResponse.json(
      {
        success: true,
        message: "Admission form submitted successfully",
        admissionId: newAdmission._id,
        isPrnGenerated: newAdmission.isPrnGenerated,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admission POST error:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate value error",
          error: error.message,
          field: Object.keys(error.keyPattern)[0],
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get('search');

    let query = {};
    
    // If search term provided, add search criteria
    if (searchTerm) {
      query = {
        $or: [
          { fullName: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
          { dteApplicationNumber: { $regex: searchTerm, $options: 'i' } },
          { studentWhatsappNumber: { $regex: searchTerm, $options: 'i' } }
        ]
      };
    }

    // Fetch admissions with optional search
    const admissions = await Admission.find(query).lean();

    return NextResponse.json({
      success: true,
      count: admissions.length,
      data: admissions,
    });
  } catch (error) {
    console.error("Error fetching admissions:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Admission ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    
    // Only update the fields that are provided in the request
    const updateFields = {};
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.isPrnGenerated !== undefined) updateFields.isPrnGenerated = body.isPrnGenerated;
    
    // Add other fields only if they exist in the body
    const optionalFields = [
      'enquiryId', 'counsellorId', 'assignedStaff', 'dteApplicationNumber',
      'admissionYear', 'email', 'fullName', 'nameAsPerAadhar', 'firstName',
      'middleName', 'lastName', 'gender', 'programType', 'year', 'branch',
      'shift', 'division', 'round', 'quota', 'seatType', 'admissionCategoryDTE',
      'feesCategory', 'totalFees', 'admissionType', 'casteAsPerLC', 'subCasteAsLC',
      'domicile', 'nationality', 'religionAsPerLC', 'isForeignNational',
      'dateOfBirth', 'motherName', 'familyIncome', 'studentWhatsappNumber',
      'fatherGuardianWhatsappNumber', 'motherMobileNumber', 'address',
      'documents'
    ];
    
    optionalFields.forEach(field => {
      if (body[field] !== undefined) {
        updateFields[field] = body[field];
      }
    });

    const updatedAdmission = await Admission.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedAdmission) {
      return NextResponse.json(
        { success: false, message: "Admission not found" },
        { status: 404 }
      );
    }

    console.log("updatedAdmission",updatedAdmission);
    
    return NextResponse.json(
      { success: true, data: updatedAdmission },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admission PUT error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate value error",
          error: error.message,
          field: Object.keys(error.keyPattern)[0],
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}