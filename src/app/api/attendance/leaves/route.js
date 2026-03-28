import { connectToDatabase } from "@/app/lib/mongodb";
import Leave from "@/models/leave";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    let query = {};
    if (userId) query.staffId = userId;
    if (status) query.status = status;

    const leaves = await Leave.find(query)
      .sort({ appliedAt: -1 })
      .populate({ path: 'staffId' }); // Dynamic populate based on refPath
      
    return NextResponse.json({ success: true, data: leaves });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { staffId, role, fromDate, toDate, reason, type } = body;

    const missingFields = [];
    if (!staffId) missingFields.push("staffId");
    if (!role) missingFields.push("role");
    if (!fromDate) missingFields.push("fromDate");
    if (!toDate) missingFields.push("toDate");
    if (!reason) missingFields.push("reason");
    if (!type) missingFields.push("type");

    if (missingFields.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Missing required fields: ${missingFields.join(", ")}` 
      }, { status: 400 });
    }

    const newLeave = await Leave.create({
      staffId,
      role,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      reason,
      type,
      status: "pending"
    });

    return NextResponse.json({ success: true, data: newLeave });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { leaveId, status } = body;

    if (!leaveId || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(leaveId, { status }, { new: true });
    return NextResponse.json({ success: true, data: updatedLeave });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
