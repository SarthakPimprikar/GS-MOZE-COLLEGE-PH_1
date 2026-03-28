import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Book from "@/app/models/bookSchema";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("query");

    let filter = {};
    if (category && category !== "all") filter.category = category;
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
        { isbn: { $regex: query, $options: "i" } }
      ];
    }

    const books = await Book.find(filter).sort({ title: 1 });
    return NextResponse.json({ success: true, data: books });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const newBook = await Book.create(body);
    return NextResponse.json({ success: true, data: newBook });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
