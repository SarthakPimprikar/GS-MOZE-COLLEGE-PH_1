import { NextResponse } from "next/server";
import { COffRequest } from "@/models/Talent";
import teacher from "@/app/models/teacherSchema";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    const department = searchParams.get("department");
    
    let query = {};
    if (teacherId) {
      query.teacherId = teacherId;
    } else if (department) {
      // Find all teachers in this department
      const teachersInDept = await teacher.find({ department }).select("_id");
      const teacherIds = teachersInDept.map(t => t._id);
      query.teacherId = { $in: teacherIds };
    }
    
    const requests = await COffRequest.find(query).populate("teacherId", "fullName").sort({ earnedOnDate: -1 });
    return NextResponse.json({ success: true, data: requests });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newRequest = await COffRequest.create(body);
    return NextResponse.json({ success: true, data: newRequest });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, ...updateData } = body;
    const updated = await COffRequest.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
