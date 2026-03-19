import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import CoursePlan from "@/app/models/coursePlanSchema";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: 'Course plan ID is required' },
        { status: 400 }
      );
    }

    const coursePlan = await CoursePlan.findOne({subject: id});

    if (!coursePlan) {
      return NextResponse.json(
        { message: 'Course plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(coursePlan);
  } catch (error) {
    console.error('Error fetching course plan:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}