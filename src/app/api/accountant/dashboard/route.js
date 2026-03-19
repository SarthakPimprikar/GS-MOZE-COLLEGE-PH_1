import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Mock data for now - replace with actual database queries
    const mockStats = {
      totalRevenue: 2500000,
      pendingFees: 450000,
      paidStudents: 1250,
      thisMonthRevenue: 320000,
    };

    return NextResponse.json({
      success: true,
      data: mockStats,
    });
  } catch (error) {
    console.error("Accountant dashboard API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
