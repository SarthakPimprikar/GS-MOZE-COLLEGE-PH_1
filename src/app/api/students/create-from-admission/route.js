import { connectToDatabase } from '@/lib/mongoose';
import Student from '@/app/models/studentSchema';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await connectToDatabase();
    
    const { admissionId } = await req.json();
    
    if (!admissionId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Admission ID is required' 
      }, { status: 400 });
    }

    // Import admission model
    const admission = require('@/app/models/admissionSchema').default;
    
    // Get admission details
    const admissionRecord = await admission.findById(admissionId);
    
    if (!admissionRecord) {
      return NextResponse.json({ 
        success: false, 
        message: 'Admission record not found' 
      }, { status: 404 });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ admissionId: admissionId });
    if (existingStudent) {
      return NextResponse.json({ 
        success: false, 
        message: 'Student already exists for this admission' 
      }, { status: 400 });
    }

    // Generate student ID
    const studentId = `STU${Date.now()}${Math.floor(Math.random() * 1000)}`;
    
    // Create student record with division from admission
    const studentData = {
      studentId: studentId,
      admissionId: admissionId,
      fullName: admissionRecord.fullName,
      email: admissionRecord.email,
      mobileNumber: admissionRecord.studentWhatsappNumber?.toString() || '',
      dateOfBirth: new Date(admissionRecord.dateOfBirth),
      gender: admissionRecord.gender,
      address: admissionRecord.address || [{}],
      programType: admissionRecord.programType,
      branch: admissionRecord.branch,
      currentYear: admissionRecord.year,
      division: admissionRecord.division, // ← Division from admission
      status: 'active',
      counsellorId: admissionRecord.counsellorId,
      totalFees: admissionRecord.totalFees || 0,
      feesCategory: admissionRecord.feesCategory || '',
      casteAsPerLC: admissionRecord.casteAsPerLC || '',
      subCasteAsPerLC: admissionRecord.subCasteAsPerLC || '',
      domicile: admissionRecord.domicile || '',
      nationality: admissionRecord.nationality || '',
      religionAsPerLC: admissionRecord.religionAsPerLC || '',
      isForeignNational: admissionRecord.isForeignNational || false,
      motherName: admissionRecord.motherName || '',
      familyIncome: admissionRecord.familyIncome || 0,
      fatherGuardianWhatsappNumber: admissionRecord.fatherGuardianWhatsappNumber?.toString() || '',
      motherMobileNumber: admissionRecord.motherMobileNumber?.toString() || '',
      seatType: admissionRecord.seatType || '',
      admissionCategoryDTE: admissionRecord.admissionCategoryDTE || '',
      quota: admissionRecord.quota || '',
      admissionYear: admissionRecord.admissionYear || '',
      round: admissionRecord.round || '',
      admissionType: admissionRecord.admissionType || '',
      dteApplicationNumber: admissionRecord.dteApplicationNumber || '',
      prn: admissionRecord.prn || ''
    };

    const student = new Student(studentData);
    await student.save();

    // Update admission status to approved
    admissionRecord.status = 'approved';
    await admissionRecord.save();

    return NextResponse.json({
      success: true,
      message: 'Student created successfully',
      data: {
        studentId: student.studentId,
        student: student,
        division: student.division
      }
    });

  } catch (error) {
    console.error('[CREATE_STUDENT_FROM_ADMISSION_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal Server Error' 
    }, { status: 500 });
  }
}
