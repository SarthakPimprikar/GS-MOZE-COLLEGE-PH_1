import { connectToDatabase } from "@/lib/mongoose";
import Academic from "@/app/models/academicSchema";
import Student from "@/app/models/studentSchema";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');
    const year = searchParams.get('year');
    const programType = searchParams.get('programType');
    
    if (!department || !year) {
      return NextResponse.json(
        { success: false, message: "Department and year parameters are required" },
        { status: 400 }
      );
    }
    
    // First try to get divisions from academic schema with program type filter
    const academicRecord = await Academic.findOne({ 
      department: department, 
      programType: programType,
      isActive: true 
    }).select('years').lean();
    
    let divisions = [];
    
    if (academicRecord) {
      const yearData = academicRecord.years.find(y => y.year === year);
      if (yearData) {
        divisions = yearData.divisions.map(division => division.name);
      }
    }
    
    // If no divisions found with program type, try without program type filter
    if (divisions.length === 0 && programType) {
      const fallbackRecord = await Academic.findOne({ 
        department: department, 
        isActive: true 
      }).select('years').lean();
      
      if (fallbackRecord) {
        const yearData = fallbackRecord.years.find(y => y.year === year);
        if (yearData) {
          divisions = yearData.divisions.map(division => division.name);
        }
      }
    }
    
    // If still no divisions found in academic schema, get from actual student data
    if (divisions.length === 0) {
      const students = await Student.find({
        branch: department,
        currentYear: year,
        division: { $exists: true, $ne: null, $ne: "Not Assigned" }
      }).select('division').lean();
      
      divisions = [...new Set(students.map(s => s.division))];
    }
    
    return NextResponse.json({
      success: true,
      divisions: divisions
    });
    
  } catch (error) {
    console.error('Error fetching divisions:', error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch divisions" },
      { status: 500 }
    );
  }
}
