import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import ProgramSpecificOutcome from '@/models/copo/ProgramSpecificOutcome';

// GET /api/copo/psos?department=Computer Science&programType=UG
export async function GET(req) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');
    const programType = searchParams.get('programType');
    const query = { isActive: true };
    if (department) query.department = department;
    if (programType) query.programType = programType;
    const psos = await ProgramSpecificOutcome.find(query).sort({ code: 1 });
    return NextResponse.json({ success: true, psos });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/copo/psos
export async function POST(req) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const pso = await ProgramSpecificOutcome.create(body);
    return NextResponse.json({ success: true, pso }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/copo/psos
export async function PUT(req) {
  await connectToDatabase();
  try {
    const { id, ...updates } = await req.json();
    const pso = await ProgramSpecificOutcome.findByIdAndUpdate(id, updates, { new: true });
    if (!pso) return NextResponse.json({ success: false, message: 'PSO not found' }, { status: 404 });
    return NextResponse.json({ success: true, pso });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/copo/psos
export async function DELETE(req) {
  await connectToDatabase();
  try {
    const { id } = await req.json();
    await ProgramSpecificOutcome.findByIdAndUpdate(id, { isActive: false });
    return NextResponse.json({ success: true, message: 'PSO deactivated' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
