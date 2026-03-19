import { connectToDatabase } from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import CoursePlan from "@/app/models/coursePlanSchema"

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params; // Get the ID from the URL parameters
    const body = await req.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "Course plan ID is required" },
        { status: 400 }
      );
    }

    const updatedPlan = await CoursePlan.findOneAndUpdate(
      { _id: id }, // Query by subject field
      { 
        $set: body,    // Update with the entire body
        updatedAt: new Date() 
      },
      { new: true }    // Return the updated document
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