

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Installment from '@/models/installment';

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();

  try {
    const newInstallment = await Installment.create(body);
    return NextResponse.json({ success: true, data: newInstallment });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  await connectToDatabase();

  try {
    const installments = await Installment.find().populate('studentId');
    return NextResponse.json({ success: true, data: installments });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
