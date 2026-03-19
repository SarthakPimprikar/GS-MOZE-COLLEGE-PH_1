import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Mock transactions data - replace with actual database queries
    const mockTransactions = [
      {
        _id: "1",
        studentName: "Rahul Kumar",
        studentId: "STU001",
        amount: 25000,
        type: "Tuition Fee",
        date: new Date("2024-03-01"),
        status: "Paid",
      },
      {
        _id: "2",
        studentName: "Priya Sharma",
        studentId: "STU002",
        amount: 18000,
        type: "Library Fee",
        date: new Date("2024-03-02"),
        status: "Pending",
      },
      {
        _id: "3",
        studentName: "Amit Patel",
        studentId: "STU003",
        amount: 35000,
        type: "Hostel Fee",
        date: new Date("2024-03-03"),
        status: "Paid",
      },
      {
        _id: "4",
        studentName: "Sneha Reddy",
        studentId: "STU004",
        amount: 22000,
        type: "Exam Fee",
        date: new Date("2024-03-04"),
        status: "Pending",
      },
      {
        _id: "5",
        studentName: "Vikram Singh",
        studentId: "STU005",
        amount: 40000,
        type: "Tuition Fee",
        date: new Date("2024-03-05"),
        status: "Paid",
      },
    ];

    return NextResponse.json({
      success: true,
      data: mockTransactions,
    });
  } catch (error) {
    console.error("Accountant transactions API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
