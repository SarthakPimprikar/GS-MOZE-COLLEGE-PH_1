//GET and POST handler to create neew enquiry and fetch all enquiry

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import enquirySchema from '../../models/enquirySchema';

export async function GET() {
  try {
    await connectToDatabase();
    const enquiries = await enquirySchema.find().sort({
      createdAt: -1
    }); // latest first
    return NextResponse.json(enquiries, {
      status: 200
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json({
      message: 'Server error'
    }, {
      status: 500
    });
  }
}
//sample
// export async function POST(req) {
//   try {
//     await connectToDatabase();
//     const body = await req.json();
//     const {firstName,middleName,lastName,phone,email,course,source,notes}= body
//     const enquiry = new enquirySchema({
//       first : firstName,
//       middle : middleName,
//       last : lastName,
//       phone,
//       email,
//       courseInterested:course,
//       source,
//       notes,

//     });
//     await enquiry.save();

//     return NextResponse.json({
//       success: true,
//       message: 'Enquiry submitted successfully'
//     }, {
//       status: 201
//     });

//   } catch (error) {
//     console.error('Error creating enquiry:', error);
//     return NextResponse.json({
//       success: false,
//       message: error.message,
//     }, {
//       status: 400
//     });
//   }
// }


export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const {
      firstName,
      middleName,
      lastName,
      phone,
      email,
      programType,
      course,
      source,
      notes,
      counsellorId   // optional (but must come from body)
    } = body;

    // Basic validation
    if (!firstName || !lastName || !phone) {
      return NextResponse.json(
        { message: "First name, last name, and phone are required." },
        { status: 400 }
      );
    }

    // Create enquiry correctly
    const newEnquiry = new enquirySchema({
      first: firstName,
      middle: middleName,
      last: lastName,
      phone,
      email,
      programType,
      courseInterested: course,
      source,
      notes,
      counsellorId: counsellorId || null
    });

    await newEnquiry.save();


    console.log("Enquiry created successfully", newEnquiry);

    return NextResponse.json(
      { success: true, message: "Enquiry submitted successfully", enquiry: newEnquiry },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
