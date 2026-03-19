import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Student from '@/app/models/studentSchema';

export async function GET() {
  try {
    await connectToDatabase();

    const students = await Student.find({}).lean();

    // Transform student data to payment records
    const paymentRecords = students.map(student => ({
      _id: student._id,
      studentName: student.fullName,
      studentId: student.studentId,
      feeType: student.feesCategory || 'Tuition Fee',
      amount: student.totalFees || 0,
      paymentDate: student.totalFees > 0 ?
        new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : // Random date within last 90 days
        new Date().toISOString().split('T')[0],
      status: student.totalFees > 0 ?
        (Math.random() > 0.3 ? 'Paid' : 'Pending') : // Mock payment status
        'Paid',
      transactionId: student.totalFees > 0 ?
        `TXN${Date.now()}${Math.floor(Math.random() * 1000)}` :
        `TXN000000`,
      email: student.email,
      department: student.branch || 'Not Assigned'
    }));

    return NextResponse.json({
      success: true,
      data: paymentRecords
    });

  } catch (error) {
    console.error('[GET_PAYMENTS_ERROR]', error);
    return NextResponse.json({
      success: false,
      message: 'Internal Server Error'
    }, { status: 500 });
  }
}
