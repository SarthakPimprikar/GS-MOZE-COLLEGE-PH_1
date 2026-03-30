import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import AMC from "@/models/AMC";

export async function GET(request) {
  try {
    await connectToDatabase();
    const amcs = await AMC.find().populate('itemId lastUpdatedBy', 'itemName name');
    return NextResponse.json(amcs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch AMCs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const newAmc = await AMC.create(body);
    return NextResponse.json(newAmc, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create AMC" }, { status: 500 });
  }
}
