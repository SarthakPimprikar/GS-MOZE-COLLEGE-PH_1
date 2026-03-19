import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Assessment from '@/models/copo/Assessment';
import AssessmentMark from '@/models/copo/AssessmentMark';
import CourseOutcome from '@/models/copo/CourseOutcome';
import COAttainment from '@/models/copo/COAttainment';
import COPOAuditLog from '@/models/copo/COPOAuditLog';

/**
 * POST /api/copo/attainment/calculate
 * Body: { subjectCode, academicYear, calculatedBy }
 *
 * Algorithm:
 * 1. Fetch all approved COs for the subject
 * 2. Fetch all assessments for the subject
 * 3. For each CO:
 *    a. Find all assessments that map to this CO
 *    b. For each assessment, find all marks
 *    c. Calculate question-level marks for this CO per student
 *    d. Check if student scored >= threshold% for this CO
 *    e. CO attainment = (students >= threshold / total students) * 100
 * 4. Save/update COAttainment documents
 */
export async function POST(req) {
  await connectToDatabase();
  try {
    const { subjectCode, academicYear, calculatedBy } = await req.json();

    if (!subjectCode || !academicYear) {
      return NextResponse.json({ success: false, message: 'subjectCode and academicYear are required' }, { status: 400 });
    }

    // Step 1: Get approved COs
    const cos = await CourseOutcome.find({ subjectCode, academicYear, isLatest: true, isActive: true });
    if (!cos.length) {
      return NextResponse.json({ success: false, message: 'No COs found for this subject/year' }, { status: 404 });
    }

    // Step 2: Get all assessments for this subject
    const assessments = await Assessment.find({ subjectCode, academicYear, isActive: true });
    if (!assessments.length) {
      return NextResponse.json({ success: false, message: 'No assessments found' }, { status: 404 });
    }

    // Step 3: Get all marks for all assessments
    const assessmentIds = assessments.map(a => a._id.toString());
    const allMarks = await AssessmentMark.find({ assessmentId: { $in: assessmentIds } });

    // Build a lookup: assessmentId -> array of student marks
    const marksByAssessment = {};
    for (const mark of allMarks) {
      const aid = mark.assessmentId.toString();
      if (!marksByAssessment[aid]) marksByAssessment[aid] = [];
      marksByAssessment[aid].push(mark);
    }

    const attainmentResults = [];

    // Step 4: For each CO, calculate attainment across assessments
    for (const co of cos) {
      const coId = co._id.toString();
      const assessmentBreakdown = [];
      let weightedSum = 0;
      let totalWeight = 0;

      for (const assessment of assessments) {
        const aid = assessment._id.toString();
        const threshold = assessment.threshold || 60;
        const weightage = assessment.weightage || 100;

        // Find questions in this assessment that map to this CO
        const coQuestions = assessment.questionCOMap?.filter(q =>
          q.coIds?.some(id => id.toString() === coId)
        ) || [];

        if (coQuestions.length === 0) continue; // CO not assessed here

        const maxForCO = coQuestions.reduce((s, q) => s + (q.maxMarks || 0), 0);
        const thresholdMarks = (threshold / 100) * maxForCO;

        const marksForAsmt = marksByAssessment[aid] || [];
        const totalStudents = marksForAsmt.filter(m => !m.isAbsent).length;
        let studentsAbove = 0;
        let sumForCO = 0;

        for (const mark of marksForAsmt) {
          if (mark.isAbsent) continue;
          // Sum marks for questions related to this CO
          let studentCOMarks = 0;
          for (const q of coQuestions) {
            const qMark = mark.questionMarks?.find(qm => qm.questionNo === q.questionNo);
            studentCOMarks += qMark?.marksObtained || 0;
          }
          sumForCO += studentCOMarks;
          if (studentCOMarks >= thresholdMarks) studentsAbove++;
        }

        const coAttainmentForAsmt = totalStudents > 0 ? (studentsAbove / totalStudents) * 100 : 0;
        const avgMarks = totalStudents > 0 ? sumForCO / totalStudents : 0;

        assessmentBreakdown.push({
          assessmentId: assessment._id,
          assessmentName: assessment.name,
          assessmentType: assessment.type,
          average: Math.round(avgMarks * 100) / 100,
          attainment: Math.round(coAttainmentForAsmt * 100) / 100,
        });

        weightedSum += coAttainmentForAsmt * weightage;
        totalWeight += weightage;
      }

      const finalAttainment = totalWeight > 0 ? weightedSum / totalWeight : 0;
      const totalStudents = allMarks.filter(m => !m.isAbsent).length;

      // Save/update COAttainment
      const attainmentDoc = await COAttainment.findOneAndUpdate(
        { coId: co._id, academicYear },
        {
          coId: co._id,
          coCode: co.code,
          subjectCode,
          subjectName: co.subjectName,
          department: co.department,
          semester: co.semester,
          academicYear,
          batch: co.batch,
          totalStudents,
          studentsAboveThreshold: Math.round((finalAttainment / 100) * totalStudents),
          threshold: assessments[0]?.threshold || 60,
          attainmentPercentage: Math.round(finalAttainment * 100) / 100,
          assessmentBreakdown,
          calculatedAt: new Date(),
          calculatedBy,
        },
        { upsert: true, new: true }
      );

      attainmentResults.push(attainmentDoc);
    }

    await COPOAuditLog.create({
      entityType: 'COAttainment',
      entityId: attainmentResults[0]?._id,
      action: 'calculated',
      performedBy: calculatedBy,
      details: { subjectCode, academicYear, coCount: attainmentResults.length }
    });

    return NextResponse.json({
      success: true,
      message: `CO attainment calculated for ${attainmentResults.length} COs`,
      results: attainmentResults
    });
  } catch (error) {
    console.error('[ATTAINMENT_CALC_ERROR]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
