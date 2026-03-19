import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import PlacementApplication from '@/models/PlacementApplication';
import PlacementDrive from '@/models/PlacementDrive';
import Student from '@/app/models/studentSchema';

export async function GET(req) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const driveId = searchParams.get('driveId');
    const studentId = searchParams.get('studentId');
    
    let query = {};
    if (driveId) query.driveId = driveId;
    if (studentId) query.studentId = studentId;
    
    const applications = await PlacementApplication.find(query)
      .populate({ 
        path: 'studentId', 
        select: 'fullName studentId branch currentSemester' 
      })
      .populate({
        path: 'driveId',
        select: 'jobTitle ctcPackage companyId driveDate status',
        populate: { path: 'companyId', select: 'name logoUrl' }
      })
      .sort({ createdAt: -1 });
      
    return NextResponse.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    console.error('Applications GET Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { studentId, driveId } = await req.json();
    
    if (!studentId || !driveId) {
      return NextResponse.json({ success: false, message: 'studentId and driveId are required' }, { status: 400 });
    }
    
    // Check if already applied
    const existing = await PlacementApplication.findOne({ studentId, driveId });
    if (existing) {
      return NextResponse.json({ success: false, message: 'You have already applied for this drive' }, { status: 400 });
    }
    
    const newApplication = await PlacementApplication.create({
      studentId,
      driveId,
      status: 'Applied'
    });
    
    return NextResponse.json({ success: true, message: 'Application submitted successfully', data: newApplication }, { status: 201 });
  } catch (error) {
    console.error('Applications POST Error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: 'Already applied' }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
