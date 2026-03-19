import { NextResponse } from 'next/server';

export async function GET() {
  // Return an empty array or mock data for assignments as the schema doesn't exist yet
  return NextResponse.json([], { status: 200 });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const newAssignment = {
      id: Date.now().toString(),
      ...body,
      status: "active",
      submitted: 0
    };
    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 400 });
  }
}

export async function DELETE(req) {
  return NextResponse.json({ success: true });
}
