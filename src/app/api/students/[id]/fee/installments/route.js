import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongoose';
import Student from '@/models/student';
import {FeeStructure} from '@/models/feeStructure';
import InstallmentPlan from '@/models/installmentPlan';

export async function POST(req, context) {
  console.log("🚀 POST /api/students/[id]/fee/installments - Start");

  await connectToDatabase();

  try {
    const {id : studentId} = await params;
    console.log("📌 studentId:", studentId);

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return NextResponse.json({ success: false, error: 'Invalid student ID' }, { status: 400 });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    console.log("📄 Student document:", student);

    const { course, category, class: studentClass, department } = student;

    const feeStructureQuery = {
      course,
      category,
      class: studentClass,
      department,
    };

    console.log("🔍 Searching FeeStructure for:", feeStructureQuery);

    const feeStructure = await FeeStructure.findOne(feeStructureQuery); // ✅ FIXED

    if (!feeStructure) {
      return NextResponse.json({ success: false, error: 'Fee structure not found' }, { status: 404 });
    }

    console.log("📦 FeeStructure found:", feeStructure);

    const totalFee = feeStructure.totalFee;
    console.log("💰 totalFee from FeeStructure:", totalFee);

    const body = await req.json();
    let { installments } = body;

    console.log("📥 Received installments:", installments);

    const definedInstallments = installments.filter(i => i !== null);
    const sum = definedInstallments.reduce((acc, val) => acc + val, 0);

    console.log("🧮 Sum of entered installments:", sum);

    const remaining = totalFee - sum;

    const nullIndex = installments.findIndex(i => i === null);
    if (nullIndex !== -1) {
      installments[nullIndex] = remaining;
    }

    console.log("📌 Remaining amount for last installment:", remaining);
    console.log("✅ Final Installment Plan:", installments);

    const installmentPlan = await InstallmentPlan.create({
      studentId,
      installments,
      totalFee,
    });

    console.log("🆕 Created InstallmentPlan:", installmentPlan);

    return NextResponse.json({
      success: true,
      message: 'Installments assigned successfully',
      data: installmentPlan,
    });
  } catch (err) {
    console.error("💥 POST Error:", err);
    return NextResponse.json({
      success: false,
      error: err.message,
    }, { status: 500 });
  }
}


/*
export async function GET(_, { params }) {
  await connectToDatabase();
  const studentId = params.id;
  console.log("📥 GET installments for studentId:", studentId);

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    console.error("❌ Invalid student ID format");
    return NextResponse.json({ success: false, message: 'Invalid student ID' }, { status: 400 });
  }

  try {
    const data = await InstallmentPlan.findOne({ studentId });
    if (!data) {
      console.log("ℹ️ No installments found");
      return NextResponse.json({
        success: true,
        message: 'Installments not yet defined for this student',
        data: []
      });
    }

    console.log("📤 Installments fetched successfully");
    return NextResponse.json({
      success: true,
      data
    });

  } catch (err) {
    console.error("💥 GET Error:", err);
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}
*/



export async function GET(request, { params }) {
  await connectToDatabase();
  const {id} = await params;
  const inputId = id // Handle both parameter names
  console.log("📥 GET installments for student identifier:", inputId);

  try {
    let student;

    // 1️⃣ Check if inputId is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(inputId)) {
      // Try finding by ObjectId first
      student = await Student.findById(inputId);
      
      // If not found as Student, check if it's directly an InstallmentPlan ID
      if (!student) {
        const directPlan = await InstallmentPlan.findOne({ _id: inputId });
        if (directPlan) {
          console.log("📤 Found installment plan directly by ID");
          return NextResponse.json({
            success: true,
            data: directPlan
          });
        }
      }
    }

    // 2️⃣ If not found or invalid ObjectId, try to find by string studentId
    if (!student) {
      student = await Student.findOne({ studentId: inputId });
    }

    // 3️⃣ Handle case where student isn't found
    if (!student) {
      console.log("ℹ️ No student found with identifier:", inputId);
      return NextResponse.json({ 
        success: false, 
        message: 'Student not found' 
      }, { status: 404 });
    }

    // 4️⃣ Get the Installment Plan using student's _id
    const plan = await InstallmentPlan.findOne({ studentId: student._id });

    if (!plan) {
      console.log("ℹ️ No installments found for student:", student._id);
      return NextResponse.json({
        success: true,
        message: 'Installments not yet defined for this student',
        data: []
      });
    }

    console.log("📤 Installments fetched successfully");
    return NextResponse.json({
      success: true,
      data: plan
    });

  } catch (err) {
    console.error("💥 GET Error:", err);
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
}

