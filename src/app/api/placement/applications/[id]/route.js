import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import PlacementApplication from '@/models/PlacementApplication';

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();
    
    // Updates typically involve advancing interview stages or changing the macro status
    const updated = await PlacementApplication.findByIdAndUpdate(
      id, 
      body, 
      { new: true, runValidators: true }
    )
    .populate('studentId', 'fullName studentId')
    .populate('driveId', 'jobTitle companyId');
    
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Applications PUT Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const deleted = await PlacementApplication.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Applications DELETE Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
