// app/api/admin/courses/route.js
import { connectToDatabase } from "@/app/lib/mongodb";
import Academic from "../../models/academicSchema";
import { NextResponse } from "next/server";
import CoursePlan from "@/app/models/coursePlanSchema"

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch only active academics and select department and programType
    const academics = await Academic.find({ isActive: true })
      .select('department programType')
      .lean(); // Convert to plain JavaScript objects
    
    // Create courses array with name (department) and programType from database
    const courses = academics.map(academic => ({
      name: academic.department,
      programType: academic.programType || 'UG' // Use programType from database, fallback to UG
    }));
    
    // Filter out any entries with missing values
    const filteredCourses = courses.filter(
      course => course.name && course.programType
    );
    
    // Extract unique program types
    const programTypes = [...new Set(filteredCourses.map(course => course.programType))];
    
    // Return the data in the requested structure
    return NextResponse.json({
      programTypes,
      courses: filteredCourses
    });
  } catch (error) {
    console.error('Error fetching academic data:', error);
    return NextResponse.json(
      { error: "Failed to fetch academic data" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    console.log("db connected");
    
    const body = await req.json();

    console.log(body);
    
    // Validate required fields
    if (!body.teacherId || !body.subject) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newCoursePlan = new CoursePlan({
      teacherId: body.teacherId,
      subject: body.subject,
      branch: body.branch,
      year: body.year,
      division: body.division || "-",
      batch: body.batch || "-",
      loadType: body.loadType,
      title: body.title,
      description: body.description,
      modules: body.modules,
    });

    console.log(newCoursePlan.modules.lessons);
    
    console.log("new Course Plan",newCoursePlan);
  
    await newCoursePlan.save();

    return NextResponse.json(
      { message: "Course plan created successfully", data: newCoursePlan },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating course plan:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          success: false,
          message: "Validation failed",
          errors: errors
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create course plan" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { error: "Course plan ID is required" },
        { status: 400 }
      );
    }

    const updatedPlan = await CoursePlan.findByIdAndUpdate(
      body.id,
      {
        coursePlan: body.coursePlan,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedPlan) {
      return NextResponse.json(
        { error: "Course plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Course plan updated successfully", data: updatedPlan },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating course plan:", error);
    return NextResponse.json(
      { error: "Failed to update course plan" },
      { status: 500 }
    );
  }
}