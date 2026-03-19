// src/app/models/noteSchema.js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  link: { type: String },
  fileUrl: { type: String }, // Cloudinary URL
  uploadedBy: { type: String }, // teacherId
}, { timestamps: true });

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);
export default Note;
