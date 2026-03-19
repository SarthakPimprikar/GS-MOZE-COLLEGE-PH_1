import { connectToDatabase } from "@/lib/mongoose";
import Academic from "@/app/models/academicSchema";
import Student from "@/app/models/studentSchema";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department');
    
    if (!department) {
      return NextResponse.json(
        { success: false, message: "Department parameter is required" },
        { status: 400 }
      );
    }
    
    let years = [];
    
    // First try to get years from academic schema
    const academicRecord = await Academic.findOne({ 
      department: department, 
      isActive: true 
    }).select('years.year').lean();
    
    if (academicRecord) {
      years = academicRecord.years.map(yearObj => yearObj.year);
    }
    
    // If no years found in academic schema, get from actual student data
    if (years.length === 0) {
      const students = await Student.find({
        branch: department,
        currentYear: { $exists: true, $ne: null, $ne: "Not Assigned" }
      }).select('currentYear').lean();
      
      years = [...new Set(students.map(s => s.currentYear))];
    }
    
    return NextResponse.json({
      success: true,
      years: years
    });
    
  } catch (error) {
    console.error('Error fetching years:', error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch years" },
      { status: 500 }
    );
  }
}
