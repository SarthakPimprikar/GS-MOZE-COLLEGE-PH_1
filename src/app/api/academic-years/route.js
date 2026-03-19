import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import Student from '@/app/models/studentSchema';

export async function GET() {
  try {
    await connectToDatabase();

    // Get unique years from student records
    const students = await Student.find({}).select('admissionYear currentYear').lean();
    
    // Extract unique years
    const uniqueYears = [...new Set(
      students
        .map(student => student.admissionYear || student.currentYear)
        .filter(year => year) // Remove null/undefined
    )];

    // Transform to expected format
    const yearData = uniqueYears.map(year => ({
      _id: year,
      year: year
    }));

    return NextResponse.json({
      success: true,
      data: yearData
    });

  } catch (error) {
    console.error('[GET_ACADEMIC_YEARS_ERROR]', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal Server Error' 
    }, { status: 500 });
  }
}
