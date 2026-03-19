import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Company from '@/models/Company';

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const companies = await Company.find(query).sort({ name: 1 });
    return NextResponse.json({ success: true, data: companies });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    // Check dupe
    const existing = await Company.findOne({ name: body.name });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Company already exists' }, { status: 400 });
    }
    
    const newCompany = await Company.create(body);
    return NextResponse.json({ success: true, data: newCompany }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
