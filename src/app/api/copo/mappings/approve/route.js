import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import COPOMapping from '@/models/copo/COPOMapping';
import CourseOutcome from '@/models/copo/CourseOutcome';
import COPOAuditLog from '@/models/copo/COPOAuditLog';

// POST /api/copo/mappings/approve — HOD approves or rejects a mapping
export async function POST(req) {
  await connectToDatabase();
  try {
    const { mappingId, action, hodId, rejectionReason } = await req.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, message: 'Invalid action. Use approve or reject.' }, { status: 400 });
    }

    const updateData = {
      status: action === 'approve' ? 'approved' : 'rejected',
      approvedBy: hodId,
      approvedAt: action === 'approve' ? new Date() : null,
      rejectionReason: action === 'reject' ? rejectionReason : '',
    };

    const mapping = await COPOMapping.findByIdAndUpdate(mappingId, updateData, { new: true });
    if (!mapping) return NextResponse.json({ success: false, message: 'Mapping not found' }, { status: 404 });

    // If approved, also approve all linked COs in submitted status for this subject
    if (action === 'approve') {
      await CourseOutcome.updateMany(
        { subjectCode: mapping.subjectCode, academicYear: mapping.academicYear, status: 'submitted' },
        { status: 'approved', approvedBy: hodId, approvedAt: new Date() }
      );
    }

    await COPOAuditLog.create({
      entityType: 'COPOMapping', entityId: mappingId,
      action: action === 'approve' ? 'approved' : 'rejected',
      performedBy: hodId,
      details: { rejectionReason, subjectCode: mapping.subjectCode, academicYear: mapping.academicYear }
    });

    return NextResponse.json({ success: true, mapping, message: `Mapping ${action}d successfully.` });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
