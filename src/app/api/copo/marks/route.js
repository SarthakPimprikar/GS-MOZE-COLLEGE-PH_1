import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import AssessmentMark from '@/models/copo/AssessmentMark';
import Assessment from '@/models/copo/Assessment';

// GET /api/copo/marks?assessmentId=xxx
export async function GET(req) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const assessmentId = searchParams.get('assessmentId');
    const subjectCode = searchParams.get('subjectCode');
    const academicYear = searchParams.get('academicYear');

    const query = {};
    if (assessmentId) query.assessmentId = assessmentId;
    if (subjectCode) query.subjectCode = subjectCode;
    if (academicYear) query.academicYear = academicYear;

    const marks = await AssessmentMark.find(query);
    return NextResponse.json({ success: true, marks });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/copo/marks — Upload marks (manual or CSV parsed)
export async function POST(req) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const { marks, uploadedBy, source = 'manual' } = body;

    if (!Array.isArray(marks) || marks.length === 0) {
      return NextResponse.json({ success: false, message: 'No marks provided' }, { status: 400 });
    }

    const assessment = await Assessment.findById(marks[0].assessmentId);
    if (!assessment) return NextResponse.json({ success: false, message: 'Assessment not found' }, { status: 404 });

    const results = [];
    for (const markData of marks) {
      // Calculate total from question marks
      const total = markData.questionMarks?.reduce((sum, q) => sum + (q.marksObtained || 0), 0) || 0;

      const record = await AssessmentMark.findOneAndUpdate(
        { assessmentId: markData.assessmentId, studentId: markData.studentId },
        {
          ...markData,
          totalMarksObtained: total,
          uploadedBy,
          source,
          subjectCode: assessment.subjectCode,
          academicYear: assessment.academicYear,
        },
        { upsert: true, new: true }
      );
      results.push(record);
    }

    return NextResponse.json({ success: true, count: results.length, message: `${results.length} marks saved.` });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
