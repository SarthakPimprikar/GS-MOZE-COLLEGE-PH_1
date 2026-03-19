import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import PlacementDrive from '@/models/PlacementDrive';
import Company from '@/models/Company';

export async function GET(req) {
  try {
    await connectToDatabase();
    
    // To ensure the referential population works, we just need Company schema loaded
    // and we've imported it above.
    const drives = await PlacementDrive.find({})
      .populate('companyId', 'name logoUrl industry tier')
      .sort({ driveDate: 1 });
      
    return NextResponse.json({ success: true, count: drives.length, data: drives });
  } catch (error) {
    console.error('Drives GET Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    const newDrive = await PlacementDrive.create(body);
    
    return NextResponse.json({ success: true, data: newDrive }, { status: 201 });
  } catch (error) {
    console.error('Drives POST Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
