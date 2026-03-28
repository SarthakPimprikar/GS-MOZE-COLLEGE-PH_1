import mongoose from "mongoose";

const generatedLetterSchema = new mongoose.Schema({
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "LetterTemplate", required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, refPath: 'role', required: true },
  role: { type: String, enum: ['Student', 'Staff', 'Teacher', 'HOD', 'Admin'], required: true },
  content: { type: String, required: true }, // The final replaced HTML
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, default: Date.now },
  serialNumber: { type: String, unique: true } // For tracking e.g. REF/2026/001
}, { timestamps: true });

export default mongoose.models.GeneratedLetter || mongoose.model("GeneratedLetter", generatedLetterSchema);
