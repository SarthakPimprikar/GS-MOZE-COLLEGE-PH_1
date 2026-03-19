import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import FeeReminderRule from '@/models/feeReminderRule';

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();

  try {
    const rule = await FeeReminderRule.create(body);
    return NextResponse.json({ success: true, data: rule });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function GET() {
  await connectToDatabase();
  try {
    const rules = await FeeReminderRule.find({ active: true }).sort({ daysBefore: 1, daysAfter: 1 });
    return NextResponse.json({ success: true, data: rules });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
