import { NextResponse } from 'next/server';
//import { connectToDatabase } from '@/lib/mongoose';
import { connectToDatabase } from '@/app/lib/mongodb';
import Leave from '@/models/leave';

export async function PUT(request, { params }) {
  await connectToDatabase();

  console.log("params",params)
  try {
    const { leaveId } = await params;
    const body = await request.json();
    const { status, rejectionReason } = body;
    
    console.log('Updating leave:', leaveId, 'with status:', status);
    
    const updateData = { status };
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      updateData,
      { new: true }
    ).populate('staffId', 'name staffId');

    if (!updatedLeave) {
      return NextResponse.json({ success: false, error: 'Leave not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedLeave });
  } catch (error) {
    console.error("💥 Leave UPDATE Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 