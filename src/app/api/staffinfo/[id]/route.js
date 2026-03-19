/*
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import StaffInfo from '@/models/staffinfo';

export async function GET(request) {
  await connectToDatabase();
  
  try {
    const { searchParams } = new URL(request.url);
    const staffId = searchParams.get('staffId');
    
    if (staffId) {
      const staff = await StaffInfo.findOne({ staffId });
      return NextResponse.json(staff);
    }
    
    const staffList = await StaffInfo.find({});
    return NextResponse.json(staffList);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  
  try {
    const body = await request.json();
    const newStaff = await StaffInfo.create(body);
    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
*/


import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import StaffInfo from '@/models/staffinfo';

export async function GET(req, { params }) {
  await connectToDatabase();

  const { id: staffId } = params;

  try {
    const staffInfo = await StaffInfo.findOne({ staffId });

    if (!staffInfo) {
      return NextResponse.json({ success: false, error: 'StaffInfo not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: staffInfo });

  } catch (error) {
    console.error('GET /api/staffinfo/[id] error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
