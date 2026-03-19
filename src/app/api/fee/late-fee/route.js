import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import LateFeeRule from '@/models/lateFeeRule';

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();

  try {
    const rule = await LateFeeRule.create(body);
    return NextResponse.json({ success: true, data: rule });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function GET() {
  await connectToDatabase();
  try {
    const rules = await LateFeeRule.find().sort({ daysLate: 1 });
    return NextResponse.json({ success: true, data: rules });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
