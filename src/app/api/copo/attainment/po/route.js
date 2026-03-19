import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import COAttainment from '@/models/copo/COAttainment';
import COPOMapping from '@/models/copo/COPOMapping';
import ProgramOutcome from '@/models/copo/ProgramOutcome';
import ProgramSpecificOutcome from '@/models/copo/ProgramSpecificOutcome';
import POAttainment from '@/models/copo/POAttainment';
import COPOAuditLog from '@/models/copo/COPOAuditLog';

/**
 * GET /api/copo/attainment/po?department=Computer Science&academicYear=2024-25&action=calculate
 *
 * When action=calculate (POST-like behavior via GET query):
 * - Pull CO attainments for all subjects in the dept/year
 * - Pull approved CO-PO mappings
 * - Calculate PO attainment = Σ(CO% × mapping_level) / Σ(mapping_level)
 * - Store in POAttainment collection
 *
 * Otherwise just returns stored PO attainments.
 */
export async function GET(req) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');
    const academicYear = searchParams.get('academicYear');
    const action = searchParams.get('action'); // 'calculate' to trigger recalculation

    if (!department || !academicYear) {
      return NextResponse.json({ success: false, message: 'department and academicYear are required' }, { status: 400 });
    }

    // Return stored PO attainments if not recalculating
    if (action !== 'calculate') {
      const stored = await POAttainment.find({ department, academicYear })
        .populate('poId', 'code title description')
        .sort({ poCode: 1 });
      return NextResponse.json({ success: true, poAttainments: stored });
    }

    // ---- FULL RECALCULATION ----

    // Step 1: Get all CO attainments for this dept/year
    const coAttainments = await COAttainment.find({ department, academicYear });
    if (!coAttainments.length) {
      return NextResponse.json({ success: false, message: 'No CO attainments found. Calculate CO attainments first.' }, { status: 404 });
    }

    // Build CO attainment lookup: coId -> attainment%
    const coAttMap = {};
    for (const ca of coAttainments) {
      coAttMap[ca.coId.toString()] = ca.attainmentPercentage;
    }

    // Step 2: Get all approved mappings for this dept/year
    const mappings = await COPOMapping.find({ department, academicYear, status: 'approved' });
    if (!mappings.length) {
      return NextResponse.json({ success: false, message: 'No approved CO-PO mappings found.' }, { status: 404 });
    }

    // Build PO contribution tracker: poId -> { sumWeighted, sumLevels, contributions[] }
    const poMap = {};

    for (const mapping of mappings) {
      for (const entry of mapping.mappings) {
        if (!entry.level || entry.level === 0) continue; // skip unmapped
        const coAtt = coAttMap[entry.coId.toString()];
        if (coAtt === undefined) continue;

        const targetId = entry.targetId.toString();
        if (!poMap[targetId]) {
          poMap[targetId] = {
            poId: entry.targetId,
            poCode: entry.targetCode,
            targetType: entry.targetType,
            sumWeighted: 0,
            sumLevels: 0,
            contributions: []
          };
        }

        poMap[targetId].sumWeighted += coAtt * entry.level;
        poMap[targetId].sumLevels += entry.level;
        poMap[targetId].contributions.push({
          coId: entry.coId,
          coCode: entry.coCode,
          subjectCode: mapping.subjectCode,
          coAttainment: coAtt,
          mappingLevel: entry.level,
          weightedContribution: coAtt * entry.level,
        });
      }
    }

    const results = [];

    for (const [targetIdStr, data] of Object.entries(poMap)) {
      const attainment = data.sumLevels > 0
        ? Math.round((data.sumWeighted / data.sumLevels) * 100) / 100
        : 0;

      const doc = await POAttainment.findOneAndUpdate(
        { poId: data.poId, department, academicYear },
        {
          poId: data.poId,
          poCode: data.poCode,
          targetType: data.targetType,
          department,
          academicYear,
          attainmentPercentage: attainment,
          coContributions: data.contributions,
          calculatedAt: new Date(),
          formulaSnapshot: 'Σ(CO% × level) / Σ(level)',
        },
        { upsert: true, new: true }
      );
      results.push(doc);
    }

    await COPOAuditLog.create({
      entityType: 'POAttainment',
      entityId: results[0]?._id,
      action: 'calculated',
      performedBy: searchParams.get('calculatedBy') || 'system',
      details: { department, academicYear, poCount: results.length }
    });

    return NextResponse.json({
      success: true,
      message: `PO attainment calculated for ${results.length} POs/PSOs`,
      poAttainments: results
    });

  } catch (error) {
    console.error('[PO_ATTAINMENT_ERROR]', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
