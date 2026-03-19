import { connectToDatabase } from "@/app/lib/mongodb";
import Academic from "@/app/models/academicSchema";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params; // Extract ID from params
    
    // If an ID is provided, fetch specific subject
    if (id) {  
      // Find the academic document that contains this subject
      const academic = await Academic.findOne({
        "years.divisions.subjects._id": id
      });
      
      if (!academic) {
        return NextResponse.json(
          { error: "Subject not found" },
          { status: 404 }
        );
      }
      
      // Find the specific subject in the nested structure
      let foundSubject = null;
      
      academic.years.forEach(year => {
        year.divisions.forEach(division => {
          const subject = division.subjects.find(sub => sub._id.toString() === id);
          if (subject) {
            foundSubject = {
              department: academic.department,
              year: year.year,
              semester: year.semester,
              division: division.name,
              code: subject.code,
              name: subject.name,
              teacher: subject.teacher,
              id: subject._id
            };
          }
        });
      });
      
      if (!foundSubject) {
        return NextResponse.json(
          { error: "Subject not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ subject: foundSubject });
    }
    
    // If no ID provided, fetch all active subjects (original functionality)
    const academics = await Academic.find({ isActive: true });
    const subjects = [];
    
    academics.forEach(academic => {
      academic.years.forEach(year => {
        year.divisions.forEach(division => {
          division.subjects.forEach(subject => {
            subjects.push({
              department: academic.department,
              year: year.year,
              semester: year.semester,
              division: division.name,
              code: subject.code,
              name: subject.name,
              teacher: subject.teacher,
              id: subject._id
            });
          });
        });
      });
    });
    
    return NextResponse.json({ subjects });
    
  } catch (error) {
    console.error('Error fetching Subject data:', error);
    return NextResponse.json(
      { error: "Failed to fetch academic data" },
      { status: 500 }
    );
  }
}