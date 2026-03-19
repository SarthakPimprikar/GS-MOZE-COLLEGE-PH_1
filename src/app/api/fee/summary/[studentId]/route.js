// /api/fee/summary/[studentId]/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import  Student  from '@/models/student';
import { FeeStructure } from '@/models/feeStructure'; // your model may be named differently
import mongoose from 'mongoose';

//export async function GET(req, context) {
//  const { studentId } = context.params;
// await connectToDatabase();

export async function GET(req, context) {
  const identifier = context.params.studentId; // could be ObjectId or staffId string
  await connectToDatabase();

  try {
    // Step 1: Get student info
    const student = await Student.findById(studentId);
    if (!student) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    }

    // Step 2: Get fee structure based on student course/category/department 
    const feeStructure = await FeeStructure.findOne({
      course: student.course,
      // year: student.year,
      category: student.category,
      department: student.department
    });

    if (!feeStructure) {
      return NextResponse.json({ success: false, message: 'No applicable fee structure found' }, { status: 404 });
    }

    const finalPayable = feeStructure.totalFee || 0;

    // Step 3: Compute discounts/scholarship (use fields from student or other logic)
    const totalDiscount = student.discount || 0;
    const totalScholarship = student.scholarship || 0;
    const totalInstallment = 0; // (Optional: fetch from Installments model if applicable)

    //const finalPayable = totalFee //- (totalDiscount + totalScholarship);

    return NextResponse.json({
      success: true,
      data: {
        //totalFee,
        totalInstallment,
        totalDiscount,
        totalScholarship,
        finalPayable
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
