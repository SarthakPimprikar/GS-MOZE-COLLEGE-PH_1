import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Book from "@/app/models/bookSchema";
import Student from "@/app/models/studentSchema";
import User from "@/app/models/userSchema";
import LibraryTransaction from "@/app/models/libraryTransactionSchema";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");

    let query = {};
    if (status) query.status = status;
    if (userId) query.studentId = userId;

    const transactions = await LibraryTransaction.find(query)
      .populate("bookId", "title author isbn location")
      .populate("studentId", "fullName studentId email branch")
      .sort({ issueDate: -1 });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { bookId, studentId, studentNumber } = await req.json();

    // 1. Find book
    const book = await Book.findById(bookId);
    if (!book || book.available < 1) {
      return NextResponse.json({ success: false, error: "Book not available" }, { status: 400 });
    }

    // 2. Find student by their unique email (case-insensitive)
    let student = await Student.findOne({ 
      email: { $regex: new RegExp(`^${studentNumber}$`, 'i') } 
    });
    
    // If not found in Student, try in User collection (role: student)
    if (!student) {
      const userStudent = await User.findOne({ 
        email: { $regex: new RegExp(`^${studentNumber}$`, 'i') },
        role: "student"
      });
      if (userStudent) {
        // Map common fields or use the user as the student object
        student = userStudent;
      }
    }

    if (!student) {
      return NextResponse.json({ success: false, error: "Student not found with this email" }, { status: 404 });
    }

    // 3. Create due date (7 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    // 4. Create Transaction
    const transaction = await LibraryTransaction.create({
      bookId,
      studentId: student._id,
      dueDate
    });

    // 5. Update book availability
    book.available -= 1;
    await book.save();

    return NextResponse.json({ success: true, data: transaction });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
