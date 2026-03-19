import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import COAttainment from '@/models/copo/COAttainment';
import POAttainment from '@/models/copo/POAttainment';
import COPOMapping from '@/models/copo/COPOMapping';
import CourseOutcome from '@/models/copo/CourseOutcome';
import ProgramOutcome from '@/models/copo/ProgramOutcome';

// GET /api/copo/reports/matrix?subjectCode=CS301&academicYear=2024-25
export async function GET(req) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const subjectCode = searchParams.get('subjectCode');
    const academicYear = searchParams.get('academicYear');
    const department = searchParams.get('department');
    const reportType = searchParams.get('type') || 'matrix'; // 'matrix' | 'co' | 'po'

    if (reportType === 'co') {
      // CO attainment report for a subject
      const cos = await COAttainment.find({ subjectCode, academicYear }).populate('coId', 'code statement bloomsLevel');
      return NextResponse.json({ success: true, reportType: 'co', data: cos });
    }

    if (reportType === 'po') {
      // PO attainment report for a department
      const pos = await POAttainment.find({ department, academicYear })
        .populate('poId', 'code title description');
      return NextResponse.json({ success: true, reportType: 'po', data: pos });
    }

    if (reportType === 'matrix') {
      // CO-PO matrix report for a subject
      const mapping = await COPOMapping.findOne({ subjectCode, academicYear })
        .populate('mappings.coId', 'code statement bloomsLevel');

      const pos = await ProgramOutcome.find({ isActive: true }).sort({ code: 1 });
      const coAttainments = await COAttainment.find({ subjectCode, academicYear });

      // Build CO attainment lookup
      const coAttMap = {};
      for (const ca of coAttainments) coAttMap[ca.coId.toString()] = ca.attainmentPercentage;

      return NextResponse.json({
        success: true,
        reportType: 'matrix',
        data: { mapping, pos, coAttainments: coAttMap }
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid report type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
