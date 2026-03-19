//get route for admin to view all HODs 
import { connectToDatabase } from '../../lib/mongodb';
import teacherSchema from '../../models/teacherSchema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();

    // ✅ Fetch all teachers where role is HOD
    const hods = await teacherSchema.find({ role: 'hod' }).select('-password');

    return NextResponse.json(
      {
        message: 'List of HODs fetched successfully',
        hods,
      },
      {
        status: 200
      }
    );

  } catch (error) {
    console.error('Error fetching HODs:', error);
    return NextResponse.json({
      error: 'Internal Server Error'
    }, {
      status: 500
    });
  }
}