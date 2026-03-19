import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import CourseOutcome from '@/models/copo/CourseOutcome';
import COPOAuditLog from '@/models/copo/COPOAuditLog';

// GET /api/copo/cos?subjectCode=CS301&academicYear=2024-25
export async function GET(req) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const subjectCode = searchParams.get('subjectCode');
    const academicYear = searchParams.get('academicYear');
    const department = searchParams.get('department');
    const status = searchParams.get('status');

    const query = { isActive: true, isLatest: true };
    if (subjectCode) query.subjectCode = subjectCode;
    if (academicYear) query.academicYear = academicYear;
    if (department) query.department = department;
    if (status) query.status = status;

    const cos = await CourseOutcome.find(query).sort({ code: 1 });
    return NextResponse.json({ success: true, cos });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/copo/cos — Create new CO
export async function POST(req) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const co = await CourseOutcome.create({ ...body, status: 'draft', version: 1, isLatest: true });

    await COPOAuditLog.create({
      entityType: 'CourseOutcome', entityId: co._id,
      action: 'created', performedBy: body.createdBy,
      details: { code: co.code, statement: co.statement }
    });

    return NextResponse.json({ success: true, co }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/copo/cos — Update CO (creates new version if already approved)
export async function PUT(req) {
  await connectToDatabase();
  try {
    const { id, updatedBy, ...updates } = await req.json();
    const existing = await CourseOutcome.findById(id);
    if (!existing) return NextResponse.json({ success: false, message: 'CO not found' }, { status: 404 });

    let co;
    // If already approved, create a new version
    if (existing.status === 'approved') {
      await CourseOutcome.findByIdAndUpdate(id, { isLatest: false });
      co = await CourseOutcome.create({
        ...existing.toObject(),
        ...updates,
        _id: undefined,
        version: existing.version + 1,
        isLatest: true,
        status: 'draft',
        previousVersionId: existing._id,
        createdBy: updatedBy,
      });
    } else {
      co = await CourseOutcome.findByIdAndUpdate(id, updates, { new: true });
    }

    await COPOAuditLog.create({
      entityType: 'CourseOutcome', entityId: co._id,
      action: 'updated', performedBy: updatedBy,
      details: { newVersion: co.version }
    });

    return NextResponse.json({ success: true, co });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE /api/copo/cos
export async function DELETE(req) {
  await connectToDatabase();
  try {
    const { id, deletedBy } = await req.json();
    await CourseOutcome.findByIdAndUpdate(id, { isActive: false });
    await COPOAuditLog.create({
      entityType: 'CourseOutcome', entityId: id,
      action: 'deleted', performedBy: deletedBy
    });
    return NextResponse.json({ success: true, message: 'CO deactivated' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
