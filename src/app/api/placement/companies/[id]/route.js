import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Company from '@/models/Company';

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await req.json();
    
    const updated = await Company.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    
    const deleted = await Company.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    
    return NextResponse.json({ success: true, message: 'Company removed successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
