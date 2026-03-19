import { NextResponse } from "next/server";
import { ElectionDuty } from "@/models/Talent";
import { connectToDatabase } from "@/app/lib/mongodb";


export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    
    let query = {};
    if (teacherId) query.teacherId = teacherId;
    
    const duties = await ElectionDuty.find(query).sort({ startDate: -1 });
    return NextResponse.json({ success: true, data: duties });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newDuty = await ElectionDuty.create(body);
    return NextResponse.json({ success: true, data: newDuty });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
