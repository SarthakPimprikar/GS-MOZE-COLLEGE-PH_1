import { NextResponse } from 'next/server';
//import { connectToDatabase } from '@/lib/mongoose';
import { connectToDatabase } from '@/app/lib/mongodb';
import Leave from '@/models/leave';
import Staff from '@/models/staff';

export async function POST(req) {
  await connectToDatabase();

  try {
    const body = await req.json();
    const { staffId, fromDate, toDate, reason, type } = body;

    // ✅ Find the staff using either ObjectId or staffId string
    let staff = null;

    if (staffId && staffId.length === 24 && /^[a-fA-F0-9]{24}$/.test(staffId)) {
      staff = await Staff.findById(staffId);
    }

    if (!staff) {
      staff = await Staff.findOne({ staffId }); // Use "STF001"
    }

    if (!staff) {
      return NextResponse.json({ success: false, message: 'Staff not found' }, { status: 404 });
    }

    // ✅ Create the leave with ObjectId reference
    const leave = await Leave.create({
      staffId: staff._id, // Pass ObjectId not string
      fromDate,
      toDate,
      reason,
      type
    });

    return NextResponse.json({ success: true, message: 'Leave request submitted', data: leave }, { status: 201 });

  } catch (error) {
    console.error("💥 Leave POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


// Get all leave requests (GET)
/*  export async function GET() {
  try {
    await connectToDatabase();
    const leaves = await Leave.find();
    return Response.json({ success: true, data: leaves });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

*/

export async function GET() {
  await connectToDatabase();

  try {
    const leaves = await Leave.find({}).populate({
      path: 'staffId',
      select: 'name staffId'
    });
     

    return NextResponse.json({ success: true, data: leaves });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}




export async function PUT(request) {
  await connectToDatabase();
  try {
    const { leaveId, status } = await request.json();

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    if (!updatedLeave) {
      return NextResponse.json({ success: false, error: 'Leave not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedLeave });
  } catch (error) {
    console.error("💥 Leave APPROVAL Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
