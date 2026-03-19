import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import PaymentTracking from '@/app/models/paymentTrackingSchema';
import Student from '@/app/models/studentSchema';

export async function GET(req) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId');
    const admissionId = searchParams.get('admissionId');
    const academicYear = searchParams.get('academicYear');
    
    // Build query
    let query = {};
    if (studentId) {
      query.student = studentId;
    }
    if (admissionId) {
      query.admissionId = admissionId;
    }
    if (academicYear) {
      query.academicYear = academicYear;
    }
    
    // Fetch payment tracking records
    const paymentRecords = await PaymentTracking.find(query)
      .populate('student', 'fullName studentId email branch currentYear')
      .populate('feeStructure', 'programType departmentName year totalFees')
      .sort({ createdAt: -1 });
    
    // Transform data for frontend
    const transformedRecords = paymentRecords.map(record => ({
      _id: record._id,
      receiptNumber: record.receiptNumber,
      student: record.student,
      feeStructure: record.feeStructure,
      paymentComponents: record.paymentComponents,
      totalFees: record.totalFees,
      totalPaid: record.totalPaid,
      totalBalance: record.totalBalance,
      paymentMode: record.paymentMode,
      remarks: record.remarks,
      academicYear: record.academicYear,
      status: record.status,
      transactionId: record.transactionId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    }));
    
    return NextResponse.json({
      success: true,
      paymentRecords: transformedRecords
    });
    
  } catch (error) {
    console.error('[GET_PAYMENT_TRACKING_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal Server Error' 
    }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    const { studentId, receiptNumber } = body;
    
    // Build query
    let query = {};
    if (studentId) {
      query.student = studentId;
    }
    if (receiptNumber) {
      query.receiptNumber = receiptNumber;
    }
    
    // Fetch specific payment record
    const paymentRecord = await PaymentTracking.findOne(query)
      .populate('student', 'fullName studentId email branch currentYear')
      .populate('feeStructure', 'programType departmentName year totalFees');
    
    if (!paymentRecord) {
      return NextResponse.json({
        success: false,
        message: 'Payment record not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      paymentRecord: paymentRecord
    });
    
  } catch (error) {
    console.error('[GET_PAYMENT_RECORD_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal Server Error' 
    }, { status: 500 });
  }
}
