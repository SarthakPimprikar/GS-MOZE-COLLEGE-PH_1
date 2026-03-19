// /app/api/hr/route.js
import { NextResponse } from 'next/server';
//import { connectToDatabase } from '@/lib/mongoose';
//import HR from '@/models/hr'; 
import { connectToDatabase } from '@/app/lib/mongodb';
import Staff from '@/models/staff';

export async function POST(request) {
  await connectToDatabase();

  try {
    const body = await request.json();

    // 1. Create HR
    // const hr = await HR.create(body);


    // 2. Also add HR as Staff
    const staffData = {
      name: body.name,
      staffId: body.staffId,
      designation: body.designation || 'HR', // optional fallback
      department: body.department,
      email: body.email,
      phone: body.phone || '',
      salary: body.salary || 0,
      joiningDate: body.joiningDate || new Date(),
    };

    await Staff.create(staffData);
    
    return NextResponse.json({
      message: 'HR created successfully',
      hr
    });
  } catch (error) {
    console.error('POST /api/hr error:', error);
    return NextResponse.json(
      { error: 'Failed to create HR', details: error.message },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    await connectToDatabase();

    //const hrList = await HR.find(); // get all HRs
    const  staff = await Staff.find();

    return Response.json({
      success: true,
      data: staff
    });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
