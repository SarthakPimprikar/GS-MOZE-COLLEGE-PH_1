import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import Alumni from '@/models/Alumni';

export async function GET(req) {
  try {
    await connectToDatabase();
    
    // Parse query params for filtering
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get('branch');
    const year = searchParams.get('year');
    const search = searchParams.get('search');
    
    // Build query
    const query = {};
    if (branch) query.branch = branch;
    if (year) query.graduationYear = Number(year);
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { currentCompany: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Fetch alumni
    const alumni = await Alumni.find(query).sort({ graduationYear: -1, createdAt: -1 });
    
    return NextResponse.json({ success: true, count: alumni.length, data: alumni });
  } catch (error) {
    console.error('Alumni GET Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch alumni database' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    
    // Basic validation
    if (!data.fullName || !data.email || !data.graduationYear || !data.branch) {
      return NextResponse.json({ success: false, message: 'Missing required fields (fullName, email, graduationYear, branch)' }, { status: 400 });
    }
    
    // Check if email already exists
    const existingAlumni = await Alumni.findOne({ email: data.email });
    if (existingAlumni) {
      return NextResponse.json({ success: false, message: 'An alumni profile with this email already exists' }, { status: 400 });
    }
    
    // Save to DB
    const newAlumni = await Alumni.create(data);
    
    return NextResponse.json({ success: true, message: 'Alumni registered successfully', data: newAlumni }, { status: 201 });
  } catch (error) {
    console.error('Alumni POST Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to register alumni: ' + error.message }, { status: 500 });
  }
}
