import { NextResponse } from "next/server";
import { PaperPublication } from "@/models/Talent";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    
    let query = {};
    if (teacherId) query.teacherId = teacherId;
    
    const publications = await PaperPublication.find(query).sort({ publicationDate: -1 });
    return NextResponse.json({ success: true, data: publications });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newPub = await PaperPublication.create(body);
    return NextResponse.json({ success: true, data: newPub });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
