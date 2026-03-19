import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import { FeeReceipt } from '@/models/feeReceipt';
import Student from '@/app/models/studentSchema';
import FeeStructure from '@/app/models/feeStructureSchema';
import PaymentTracking from '@/app/models/paymentTrackingSchema';
import Admission from '@/app/models/admissionSchema';

export async function POST(req) {
  try {
    await connectToDatabase();

    const { studentId, admissionId, paymentMode, remarks, amountPaid, componentPayments, feeStructure } = await req.json();

    // Validate admission (primary check)
    let admission = null;
    if (admissionId) {
      admission = await Admission.findById(admissionId);
    } else if (studentId) {
      // Try to find admission by studentId as fallback
      admission = await Admission.findById(studentId);
    }
    
    if (!admission) {
      return NextResponse.json({ success: false, error: 'Admission not found' }, { status: 404 });
    }

    // Debug: Log admission data
    console.log('Admission data:', {
      _id: admission._id,
      fullName: admission.fullName,
      email: admission.email,
      programType: admission.programType,
      branch: admission.branch,
      year: admission.year,
      dteApplicationNumber: admission.dteApplicationNumber
    });

    // Use provided fee structure or find one
    let actualFeeStructure = feeStructure;
    
    if (!actualFeeStructure) {
      // Find fee structure for this admission
      actualFeeStructure = await FeeStructure.findOne({
        programType: admission.programType,
        departmentName: admission.branch,
        year: admission.year,
        category: 'general'
      });

      // If not found, try with defaults
      if (!actualFeeStructure) {
        console.log('Trying with default values...');
        actualFeeStructure = await FeeStructure.findOne({
          programType: 'B.E.',
          departmentName: 'Computer Science',
          year: '1st Year',
          category: 'regular'
        });
      }

      // If still not found, try any matching record
      if (!actualFeeStructure) {
        console.log('Trying to find any fee structure...');
        actualFeeStructure = await FeeStructure.findOne({});
      }
    }

    if (!actualFeeStructure) {
      return NextResponse.json({ 
        success: false, 
        error: 'Fee structure not found. Please ensure fee structures are created in the system.', 
        details: {
          admissionProgramType: admission.programType,
          admissionBranch: admission.branch,
          admissionYear: admission.year
        }
      }, { status: 404 });
    }

    console.log('Found fee structure:', actualFeeStructure);

    // Calculate total payable fee from the fee structure
    const totalFees = actualFeeStructure.totalFees || 0;
    const actualAmountPaid = amountPaid ? parseFloat(amountPaid) : totalFees;
    
    if (!actualAmountPaid || actualAmountPaid < 0) {
        return NextResponse.json({ success: false, error: "Invalid amount calculation" }, { status: 400 });
    }

    // Generate a unique receipt number (simple logic)
    const count = await FeeReceipt.countDocuments();
    const receiptNumber = `REC2025-${String(count + 1).padStart(4, '0')}`;

    // Create receipt with admission data included
    const newReceipt = await FeeReceipt.create({
      student: admission._id, // Keep as student for compatibility
      admission: admission._id, // Add admission reference
      receiptNumber,
      amountPaid: actualAmountPaid,
      paymentMode,
      remarks,
      academicYear: admission.admissionYear || '2025-2026'
    });

    // Populate the receipt with admission data
    let populatedReceipt;
    try {
      populatedReceipt = await FeeReceipt.findById(newReceipt._id)
        .populate('student')
        .populate('admission');
    } catch (populateError) {
      console.log('Populate error, trying without admission field:', populateError);
      // Fallback: populate only student field
      populatedReceipt = await FeeReceipt.findById(newReceipt._id)
        .populate('student');
    }

    console.log('Populated receipt data:', populatedReceipt);
    console.log('Student data in receipt:', populatedReceipt.student);

    // Add fee structure data and component payments to the response for PDF generation
    const responseReceipt = {
      ...populatedReceipt.toObject(),
      feeStructure: actualFeeStructure, // Include fee structure data for PDF generation
      componentPayments: componentPayments || {} // Include component payments for PDF generation
    };

    console.log('Final receipt response:', responseReceipt);

    // Save payment tracking data
    if (componentPayments && Object.keys(componentPayments).length > 0) {
      try {
        // Build payment components array
        const paymentComponents = [];
        
        // Process student fees
        if (actualFeeStructure.feesFromStudent) {
          actualFeeStructure.feesFromStudent.forEach(fee => {
            const paidAmount = componentPayments[fee.componentName] || 0;
            const balanceAmount = fee.amount - paidAmount;
            const status = paidAmount === 0 ? 'Unpaid' : paidAmount === fee.amount ? 'Paid' : 'Partial';
            
            paymentComponents.push({
              componentName: fee.componentName,
              totalAmount: fee.amount,
              paidAmount: paidAmount,
              balanceAmount: balanceAmount,
              status: status,
              isWelfare: false
            });
          });
        }
        
        // Process welfare fees
        if (actualFeeStructure.feesFromSocialWelfare) {
          actualFeeStructure.feesFromSocialWelfare.forEach(fee => {
            const paidAmount = componentPayments[fee.componentName] || 0;
            const balanceAmount = fee.amount - paidAmount;
            const status = paidAmount === 0 ? 'Unpaid' : paidAmount === fee.amount ? 'Paid' : 'Partial';
            
            paymentComponents.push({
              componentName: fee.componentName,
              totalAmount: fee.amount,
              paidAmount: paidAmount,
              balanceAmount: balanceAmount,
              status: status,
              isWelfare: true
            });
          });
        }

        // Create payment tracking record
        const paymentTracking = await PaymentTracking.create({
          student: admission._id, // Keep as student for compatibility
          admissionId: admission._id, // Link to admission
          receiptNumber: receiptNumber,
          feeStructure: actualFeeStructure._id,
          paymentComponents: paymentComponents,
          totalFees: totalFees,
          totalPaid: actualAmountPaid,
          totalBalance: totalFees - actualAmountPaid,
          paymentMode: paymentMode,
          remarks: remarks || `Payment of ₹${actualAmountPaid}`,
          academicYear: admission.admissionYear || '2025-2026',
          status: actualAmountPaid === totalFees ? 'Paid' : 'Partial',
          transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
          createdBy: admission._id // TODO: Update with actual user ID from session
        });

        console.log('Payment tracking saved:', paymentTracking);
      } catch (trackingError) {
        console.error('Error saving payment tracking:', trackingError);
        // Don't fail the receipt creation if tracking fails
      }
    }

    return NextResponse.json({ success: true, receipt: responseReceipt });

  } catch (error) {
    console.error('Error creating receipt:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}
