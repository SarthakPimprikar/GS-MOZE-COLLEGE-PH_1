import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import FeeHead from '@/models/feeHead';
import { connect } from 'mongoose';

// GET: List all fee heads
export async function GET() {
  await connectToDatabase();

  try {
    const feeHeads = await FeeHead.find();
    return NextResponse.json({ success: true, data: feeHeads });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create new fee head
export async function POST(request) {
  await connectToDatabase();

  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    const existing = await FeeHead.findOne({ name });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Fee Head already exists' }, { status: 400 });
    }

    const feeHead = await FeeHead.create({ name, description });
    return NextResponse.json({ success: true, data: feeHead }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
