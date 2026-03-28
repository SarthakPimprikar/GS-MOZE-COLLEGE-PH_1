import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import LetterTemplate from "@/app/models/letterTemplateSchema";

export async function GET() {
  try {
    await connectToDatabase();
    const templates = await LetterTemplate.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const template = await LetterTemplate.create(body);
    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { _id, ...updateData } = body;
    const template = await LetterTemplate.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json({ success: true, data: template });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
