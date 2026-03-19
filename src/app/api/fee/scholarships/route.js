import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Scholarship from '@/models/scholarship';

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();

  try {
    const newScholarship = await Scholarship.create(body);
    return NextResponse.json({ success: true, data: newScholarship });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
  await connectToDatabase();

  try {
    const scholarships = await Scholarship.find().populate('studentId');
    return NextResponse.json({ success: true, data: scholarships });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
