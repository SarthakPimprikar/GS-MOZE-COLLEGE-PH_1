import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import PlacementDrive from '@/models/PlacementDrive';

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();
    
    const updatedDrive = await PlacementDrive.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedDrive) {
      return NextResponse.json({ success: false, message: 'Drive not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updatedDrive });
  } catch (error) {
    console.error('Drives PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const deletedDrive = await PlacementDrive.findByIdAndDelete(id);
    if (!deletedDrive) {
      return NextResponse.json({ success: false, message: 'Drive not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Drive deleted successfully' });
  } catch (error) {
    console.error('Drives DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
