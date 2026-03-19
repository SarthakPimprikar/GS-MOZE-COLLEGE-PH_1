import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Discount from '@/models/discount';
import { connect } from 'mongoose';

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();

  try {
    const newDiscount = await Discount.create(body);
    return NextResponse.json({ success: true, data: newDiscount });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  await connectToDatabase();

  try {
    const discounts = await Discount.find().populate('studentId');
    return NextResponse.json({ success: true, data: discounts });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
