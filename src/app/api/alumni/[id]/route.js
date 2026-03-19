import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Alumni from '@/models/Alumni';

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const body = await req.json();
    
    const updatedAlumni = await Alumni.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!updatedAlumni) {
      return NextResponse.json({ success: false, message: 'Alumni record not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Alumni record updated successfully', data: updatedAlumni });
  } catch (error) {
    console.error('Alumni PUT Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update alumni record: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    
    const deletedAlumni = await Alumni.findByIdAndDelete(id);
    
    if (!deletedAlumni) {
      return NextResponse.json({ success: false, message: 'Alumni record not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Alumni record deleted successfully' });
  } catch (error) {
    console.error('Alumni DELETE Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete alumni record: ' + error.message }, { status: 500 });
  }
}
