import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import COPOMapping from '@/models/copo/COPOMapping';
import COPOAuditLog from '@/models/copo/COPOAuditLog';

// GET /api/copo/mappings?subjectCode=CS301&academicYear=2024-25
export async function GET(req) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const subjectCode = searchParams.get('subjectCode');
    const academicYear = searchParams.get('academicYear');
    const department = searchParams.get('department');

    const query = {};
    if (subjectCode) query.subjectCode = subjectCode;
    if (academicYear) query.academicYear = academicYear;
    if (department) query.department = department;

    const mappings = await COPOMapping.find(query)
      .populate('mappings.coId', 'code statement bloomsLevel')
      .sort({ subjectCode: 1 });

    return NextResponse.json({ success: true, mappings });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/copo/mappings — Upsert full mapping matrix for a subject
export async function POST(req) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const { subjectCode, academicYear, createdBy, ...rest } = body;

    const mapping = await COPOMapping.findOneAndUpdate(
      { subjectCode, academicYear },
      { ...rest, subjectCode, academicYear, status: 'draft', submittedBy: createdBy, createdBy },
      { upsert: true, new: true }
    );

    await COPOAuditLog.create({
      entityType: 'COPOMapping', entityId: mapping._id,
      action: 'updated', performedBy: createdBy,
      details: { subjectCode, academicYear, mappingCount: rest.mappings?.length }
    });

    return NextResponse.json({ success: true, mapping });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/copo/mappings — Submit draft for HOD approval
export async function PUT(req) {
  await connectToDatabase();
  try {
    const { id, submittedBy } = await req.json();
    const mapping = await COPOMapping.findByIdAndUpdate(
      id,
      { status: 'submitted', submittedBy },
      { new: true }
    );
    if (!mapping) return NextResponse.json({ success: false, message: 'Mapping not found' }, { status: 404 });

    await COPOAuditLog.create({
      entityType: 'COPOMapping', entityId: id,
      action: 'submitted', performedBy: submittedBy
    });

    return NextResponse.json({ success: true, mapping });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
