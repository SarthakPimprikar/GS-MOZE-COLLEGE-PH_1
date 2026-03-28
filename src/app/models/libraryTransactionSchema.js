import mongoose from "mongoose";

const libraryTransactionSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { type: String, enum: ["issued", "returned"], default: "issued" },
  fineAmount: { type: Number, default: 0 },
  finePaid: { type: Boolean, default: false },
  remarks: { type: String }
}, { timestamps: true });

export default mongoose.models.LibraryTransaction || mongoose.model("LibraryTransaction", libraryTransactionSchema);
