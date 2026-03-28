import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import GeneratedLetter from "@/app/models/generatedLetterSchema";
import crypto from "crypto";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    let query = {};
    if (userId) query.recipientId = userId;
    
    const letters = await GeneratedLetter.find(query)
      .populate("templateId", "name")
      .populate("generatedBy", "fullName email")
      .sort({ date: -1 });
      
    return NextResponse.json({ success: true, data: letters });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { templateId, recipientId, role, content, generatedBy } = body;
    
    // Generate Serial Number: GSM/2026/XXXXX
    const year = new Date().getFullYear();
    const count = await GeneratedLetter.countDocuments({ date: { $gte: new Date(year, 0, 1) } });
    const serialNumber = `GSM/${year}/${(count + 1).toString().padStart(4, '0')}`;
    
    const letter = await GeneratedLetter.create({
      templateId,
      recipientId,
      role,
      content,
      generatedBy,
      serialNumber
    });
    
    return NextResponse.json({ success: true, data: letter });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
