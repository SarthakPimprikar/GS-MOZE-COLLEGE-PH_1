import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Inventory from "@/models/Inventory";

export async function GET(request) {
  try {
    await connectToDatabase();
    const inventory = await Inventory.find().populate('lastUpdatedBy', 'name');
    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const newInventoryItem = await Inventory.create(body);
    return NextResponse.json(newInventoryItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 });
  }
}
