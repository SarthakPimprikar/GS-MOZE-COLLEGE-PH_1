import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Book from "@/app/models/bookSchema";
import LibraryTransaction from "@/app/models/libraryTransactionSchema";

export async function PUT(req) {
  try {
    await connectToDatabase();
    const { transactionId, remarks } = await req.json();

    // 1. Find transaction
    const transaction = await LibraryTransaction.findById(transactionId);
    if (!transaction || transaction.status === "returned") {
      return NextResponse.json({ success: false, error: "Invalid transaction" }, { status: 400 });
    }

    // 2. Calculate fine (50rs per day late)
    const today = new Date();
    const dueDate = new Date(transaction.dueDate);
    let fine = 0;

    if (today > dueDate) {
      const diffTime = Math.abs(today - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * 50;
    }

    // 3. Mark returned
    transaction.status = "returned";
    transaction.returnDate = today;
    transaction.fineAmount = fine;
    transaction.remarks = remarks || "";
    await transaction.save();

    // 4. Update book availability
    const book = await Book.findById(transaction.bookId);
    if (book) {
      book.available += 1;
      await book.save();
    }

    return NextResponse.json({ success: true, data: transaction, fineAmount: fine });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
