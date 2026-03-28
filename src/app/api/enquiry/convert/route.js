import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Enquiry from "@/app/models/enquirySchema";
import Admission from "@/app/models/admissionSchema";
import User from "@/app/models/userSchema";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { enquiryId, counsellorId } = await req.json();

    if (!enquiryId) {
      return NextResponse.json({ message: "Enquiry ID is required" }, { status: 400 });
    }

    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      return NextResponse.json({ message: "Enquiry not found" }, { status: 404 });
    }

    // Check if already converted
    if (enquiry.status === "Converted") {
      return NextResponse.json({ message: "Enquiry already converted" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: enquiry.email });
    if (existingUser) {
       // If user exists, maybe they already have an admission
       const existingAdmission = await Admission.findOne({ email: enquiry.email });
       if (existingAdmission) {
         return NextResponse.json({ message: "Admission record already exists for this email" }, { status: 400 });
       }
    }

    // 1. Create User account for student
    // Password is set to phone number by default
    // We pass plain password, User model handles hashing via pre-save hook
    let user;
    if (!existingUser) {
      user = await User.create({
        fullName: `${enquiry.first} ${enquiry.middle || ""} ${enquiry.last}`.trim(),
        email: enquiry.email,
        phone: enquiry.phone,
        password: enquiry.phone, // Passing plain phone number, model will hash it
        role: "student",
        isActive: true,
        admissionId: null, // Placeholder, updated below
      });
    } else {
      user = existingUser;
    }

    // 2. Create Admission record
    const admissionData = {
      enquiryId: enquiry._id,
      counsellorId: counsellorId,
      email: enquiry.email,
      fullName: `${enquiry.first} ${enquiry.middle || ""} ${enquiry.last}`.trim(),
      firstName: enquiry.first,
      middleName: enquiry.middle || "",
      lastName: enquiry.last,
      studentWhatsappNumber: enquiry.phone,
      branch: enquiry.courseInterested,
      programType: enquiry.programType || "",
      status: "pending", // Workflow starts at pending
    };

    const newAdmission = await Admission.create(admissionData);

    // Link Admission back to User
    user.admissionId = newAdmission._id;
    await user.save();

    // 3. Update Enquiry status
    enquiry.status = "Converted";
    enquiry.followUps.push({
      date: new Date(),
      note: "Converted to Admission and Student Account Created",
      updatedBy: counsellorId
    });
    await enquiry.save();

    return NextResponse.json({
      success: true,
      message: "Enquiry converted successfully",
      admissionId: newAdmission._id,
      userId: user._id
    }, { status: 201 });

  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}
