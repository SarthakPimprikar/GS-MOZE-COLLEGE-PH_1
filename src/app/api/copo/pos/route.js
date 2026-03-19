import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import ProgramOutcome from '@/models/copo/ProgramOutcome';

// NBA Standard PO1–PO12 Seed Data
const NBA_POS = [
  { code: 'PO1', title: 'Engineering Knowledge', description: 'Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialization to the solution of complex engineering problems.' },
  { code: 'PO2', title: 'Problem Analysis', description: 'Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences.' },
  { code: 'PO3', title: 'Design/Development of Solutions', description: 'Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for the public health and safety, and the cultural, societal, and environmental considerations.' },
  { code: 'PO4', title: 'Conduct Investigations of Complex Problems', description: 'Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions.' },
  { code: 'PO5', title: 'Modern Tool Usage', description: 'Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modeling to complex engineering activities with an understanding of the limitations.' },
  { code: 'PO6', title: 'The Engineer and Society', description: 'Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal, and cultural issues and the consequent responsibilities relevant to the professional engineering practice.' },
  { code: 'PO7', title: 'Environment and Sustainability', description: 'Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and need for sustainable development.' },
  { code: 'PO8', title: 'Ethics', description: 'Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice.' },
  { code: 'PO9', title: 'Individual and Team Work', description: 'Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings.' },
  { code: 'PO10', title: 'Communication', description: 'Communicate effectively on complex engineering activities with the engineering community and with society at large, such as, being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions.' },
  { code: 'PO11', title: 'Project Management and Finance', description: 'Demonstrate knowledge and understanding of the engineering and management principles and apply these to one\'s own work, as a member and leader in a team, to manage projects and in multidisciplinary environments.' },
  { code: 'PO12', title: 'Life-long Learning', description: 'Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change.' },
];

// GET /api/copo/pos
export async function GET(req) {
  await connectToDatabase();
  try {
    const { searchParams } = new URL(req.url);
    const programType = searchParams.get('programType') || 'UG';
    const branchId = searchParams.get('branchId');

    const query = { isActive: true };
    if (programType) query.programType = programType;
    if (branchId) query.branchId = branchId;

    const pos = await ProgramOutcome.find(query).sort({ code: 1 });
    return NextResponse.json({ success: true, pos });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST /api/copo/pos — Create custom PO or bulk-seed NBA POs
export async function POST(req) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const { seed, branchId, programType, createdBy } = body;

    // Seed NBA POs
    if (seed === 'NBA') {
      const results = [];
      for (const po of NBA_POS) {
        const existing = await ProgramOutcome.findOne({ code: po.code, branchId: branchId || null });
        if (!existing) {
          const created = await ProgramOutcome.create({
            ...po,
            programType: programType || 'UG',
            isNBAStandard: true,
            branchId: branchId || null,
            createdBy,
          });
          results.push(created);
        }
      }
      return NextResponse.json({ success: true, message: `Seeded ${results.length} NBA POs`, pos: results });
    }

    // Create single PO
    const po = await ProgramOutcome.create({ ...body, branchId: branchId || null });
    return NextResponse.json({ success: true, po }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT /api/copo/pos — Update a PO
export async function PUT(req) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    const po = await ProgramOutcome.findByIdAndUpdate(id, updates, { new: true });
    if (!po) return NextResponse.json({ success: false, message: 'PO not found' }, { status: 404 });
    return NextResponse.json({ success: true, po });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
