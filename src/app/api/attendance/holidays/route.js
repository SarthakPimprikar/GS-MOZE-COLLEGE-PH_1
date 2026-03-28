import { connectToDatabase } from "@/app/lib/mongodb";
import Holiday from "@/models/holiday";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const holidays = await Holiday.find().sort({ date: 1 });
    return NextResponse.json({ success: true, data: holidays });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { title, date, type, description } = await req.json();

    if (!title || !date) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newHoliday = await Holiday.findOneAndUpdate(
      { date: new Date(date) },
      { title, date: new Date(date), type, description },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: newHoliday });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });

    await Holiday.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Holiday deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
