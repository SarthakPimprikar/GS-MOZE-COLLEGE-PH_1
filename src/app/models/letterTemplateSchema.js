import mongoose from "mongoose";

const letterTemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  content: { type: String, required: true }, // HTML content with placeholders like {{name}}
  placeholders: [{ type: String }], // List of placeholders used in this template
  category: { type: String, enum: ['Student', 'Staff', 'General'], default: 'Student' }
}, { timestamps: true });

export default mongoose.models.LetterTemplate || mongoose.model("LetterTemplate", letterTemplateSchema);
