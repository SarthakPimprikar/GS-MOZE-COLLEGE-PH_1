// /app/api/students/[id]/fee/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import  Student  from '@/models/student';
import { FeeStructure } from '@/models/feeStructure';

export async function GET(_, { params } ) {
  const { id } = await params;
  const studentId = id;
  console.log('➡️ Student ID from URL:', studentId);
  await connectToDatabase();

  try {
    const student = await Student.findById(studentId);

    if (!student) {
      console.log(`❌ 404 Error: Student not found for ID: ${studentId}`);
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    }

    console.log(`✅ Student found: ${student.name} | Course: ${student.course} | Category: ${student.category} | Class: ${student.class} | Dept: ${student.department}`);

    const feeStructure = await FeeStructure.findOne({
      programType: student.programType || 'UG',
      departmentName: student.branch,
      year: student.currentYear,
      caste: (student.casteAsPerLC || '').toLowerCase(),
      // optionally match category if applicable, e.g., category: student.feesCategory
    });

    if (!feeStructure) {
      console.log(`❌ 404 Error: FeeStructure not found for query:`, {
        programType: student.programType || 'UG',
        departmentName: student.branch,
        year: student.currentYear,
        caste: (student.casteAsPerLC || '').toLowerCase()
      });
      return NextResponse.json({ success: false, message: 'Applicable fee structure not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      student: {
        _id: student._id,
        name: student.name,
        rollNumber: student.rollNumber,
        course: student.course,
        class: student.class,
        category: student.category,
        department: student.department
      },
      feeStructure: {
        fee: feeStructure.fee,
        totalFee: feeStructure.totalFee
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


// PUT update student
export async function PUT(req, { params }) {
  await connectToDatabase();
  try {
    const {id}= await params;
    const body = await req.json();
    const student = await Student.findByIdAndUpdate(id, body, { new: true });
    if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed', details: error.message }, { status: 400 });
  }
}

// DELETE student
export async function DELETE(req, { params }) {
  await connectToDatabase();
  try {
    const {id} = await params;
    const student = await Student.findByIdAndDelete(id);
    if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed', details: error.message }, { status: 400 });
  }
}//sample