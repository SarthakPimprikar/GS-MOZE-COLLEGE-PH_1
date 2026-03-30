import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import AMC from "@/models/AMC";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const amc = await AMC.findById(id).populate('itemId lastUpdatedBy', 'itemName name');
    if (!amc) return NextResponse.json({ error: "AMC not found" }, { status: 404 });
    return NextResponse.json(amc);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch AMC" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await request.json();
    const updatedAmc = await AMC.findByIdAndUpdate(id, body, { new: true });
    if (!updatedAmc) return NextResponse.json({ error: "AMC not found" }, { status: 404 });
    return NextResponse.json(updatedAmc);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update AMC" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const deletedAmc = await AMC.findByIdAndDelete(id);
    if (!deletedAmc) return NextResponse.json({ error: "AMC not found" }, { status: 404 });
    return NextResponse.json({ message: "AMC deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete AMC" }, { status: 500 });
  }
}
