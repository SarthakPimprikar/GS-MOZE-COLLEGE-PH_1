import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  available: { type: Number, default: 1 },
  location: { type: String, default: "General Shelf" },
  coverImage: { type: String, default: "/books/default-cover.jpg" }
}, { timestamps: true });

export default mongoose.models.Book || mongoose.model("Book", bookSchema);
