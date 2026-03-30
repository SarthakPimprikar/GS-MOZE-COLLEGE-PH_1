import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Inventory from "@/models/Inventory";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const item = await Inventory.findById(id).populate('lastUpdatedBy', 'name');
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await request.json();
    const updatedItem = await Inventory.findByIdAndUpdate(id, body, { new: true });
    if (!updatedItem) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const deletedItem = await Inventory.findByIdAndDelete(id);
    if (!deletedItem) return NextResponse.json({ error: "Item not found" }, { status: 404 });
    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
