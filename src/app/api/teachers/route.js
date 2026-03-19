// GET handler to fetch all teachers

// app/api/teachers/route.js

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import teacherSchema from '../../models/teacherSchema';

export async function GET() {
  try {
    await connectToDatabase();

    const teachers = await teacherSchema.find().select('-password'); // Remove password from response

    return NextResponse.json(teachers, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch teachers' 
    }, { 
      status: 500 
    });
  }
}