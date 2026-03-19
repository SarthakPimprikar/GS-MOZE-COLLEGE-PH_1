import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Assessment from '@/models/copo/Assessment';

// GET /api/copo/assessments?subjectCode=CS301&academicYear=2024-25
export async function GET(req) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const subjectCode = searchParams.get('subjectCode');
    const academicYear = searchParams.get('academicYear');
    const type = searchParams.get('type');
    const query = { isActive: true };
    if (subjectCode) query.subjectCode = subjectCode;
    if (academicYear) query.academicYear = academicYear;
    if (type) query.type = type;
    const assessments = await Assessment.find(query).sort({ conductedDate: -1 });
    return NextResponse.json({ success: true, assessments });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/copo/assessments
export async function POST(req) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const assessment = await Assessment.create(body);
    return NextResponse.json({ success: true, assessment }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/copo/assessments
export async function PUT(req) {
  await connectToDatabase();
  try {
    const { id, ...updates } = await req.json();
    const assessment = await Assessment.findByIdAndUpdate(id, updates, { new: true });
    if (!assessment) return NextResponse.json({ success: false, message: 'Assessment not found' }, { status: 404 });
    return NextResponse.json({ success: true, assessment });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/copo/assessments
export async function DELETE(req) {
  await connectToDatabase();
  try {
    const { id } = await req.json();
    await Assessment.findByIdAndUpdate(id, { isActive: false });
    return NextResponse.json({ success: true, message: 'Assessment removed' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
