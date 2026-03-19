// /api/fee-structure/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { FeeStructure } from '@/models/feeStructure';


// GET - fetch all or by filters
export async function GET(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const cls = searchParams.get('class');
  const department = searchParams.get('department');

  const query = {};

  if (category) query.category = category;
  if (cls) query.class = cls;
  if (department) query.department = department;

  try {
    const results = await FeeStructure.find(query);
    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}




// POST a new fee structure
export async function POST(req) {
  await connectToDatabase();
  try {
    const body = await req.json();
    const { course = 'B.E.', category, class: cls, department, fee } = body;

    // ✅ Validate required fields
    if (!category || !cls || !department || !fee) {
      return NextResponse.json({ success: false, error: 'Missing or invalid data' }, { status: 400 });
    }

    // ✅ Validate fee fields using your new names
    const { tuitionFee, libraryFee, developmentFee, examFee } = fee;
    if (
      typeof tuitionFee !== 'number' ||
      typeof libraryFee !== 'number' ||
      typeof developmentFee !== 'number' ||
      typeof examFee !== 'number'
    ) {
      return NextResponse.json({ success: false, error: 'Invalid fee structure values' }, { status: 400 });
    }

    const totalFee = tuitionFee + libraryFee + developmentFee + examFee;

    const data = await FeeStructure.findOneAndUpdate(
      { course, category, class: cls, department },
      {
        course,
        category,
        class: cls,
        department,
        fee,
        totalFee
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Fee structure insert error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const deleteAll = searchParams.get('all');

  if (deleteAll === 'true') {
    const result = await FeeStructure.deleteMany({});
    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} fee structure records`
    });
  }

  return NextResponse.json({
    success: false,
    message: 'Set ?all=true in query to delete all data'
  }, { status: 400 });
}


