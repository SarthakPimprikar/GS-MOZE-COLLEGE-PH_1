import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Book from "@/app/models/bookSchema";

const sampleBooks = [
  { title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0262033848", category: "Computer Science", quantity: 5, available: 5, location: "Shelf A1" },
  { title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", category: "Software Engineering", quantity: 3, available: 3, location: "Shelf A2" },
  { title: "Design Patterns", author: "Erich Gamma", isbn: "978-0201633610", category: "Software Engineering", quantity: 4, available: 4, location: "Shelf A2" },
  { title: "The Pragmatic Programmer", author: "Andrew Hunt", isbn: "978-0135957059", category: "Software Engineering", quantity: 2, available: 2, location: "Shelf A2" },
  { title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", isbn: "978-0134610993", category: "AI & ML", quantity: 6, available: 6, location: "Shelf B1" },
  { title: "Deep Learning", author: "Ian Goodfellow", isbn: "978-0262035613", category: "AI & ML", quantity: 4, available: 4, location: "Shelf B1" },
  { title: "Data Science from Scratch", author: "Joel Grus", isbn: "978-1492041139", category: "Data Science", quantity: 5, available: 5, location: "Shelf B2" },
  { title: "The Lean Startup", author: "Eric Ries", isbn: "978-0307887894", category: "Business", quantity: 3, available: 3, location: "Shelf C1" },
  { title: "Zero to One", author: "Peter Thiel", isbn: "978-0804139298", category: "Business", quantity: 4, available: 4, location: "Shelf C1" },
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", isbn: "978-0374275631", category: "Psychology", quantity: 2, available: 2, location: "Shelf D1" },
  { title: "Atomic Habits", author: "James Clear", isbn: "978-0735211292", category: "Self-Help", quantity: 8, available: 8, location: "Shelf D2" },
  { title: "Digital Image Processing", author: "Rafael Gonzalez", isbn: "978-0133356724", category: "Electronics", quantity: 3, available: 3, location: "Shelf E1" },
  { title: "Microelectronic Circuits", author: "Adel Sedra", isbn: "978-0199339136", category: "Electronics", quantity: 5, available: 5, location: "Shelf E1" },
  { title: "Operating System Concepts", author: "Abraham Silberschatz", isbn: "978-1118063330", category: "Computer Science", quantity: 4, available: 4, location: "Shelf A3" },
  { title: "Computer Networking", author: "James Kurose", isbn: "978-0133915624", category: "Computer Science", quantity: 5, available: 5, location: "Shelf A3" },
  { title: "Database System Concepts", author: "Abraham Silberschatz", isbn: "978-0073523323", category: "Computer Science", quantity: 6, available: 6, location: "Shelf A4" },
  { title: "Python Crash Course", author: "Eric Matthes", isbn: "978-1593279288", category: "Programming", quantity: 7, available: 7, location: "Shelf G1" },
  { title: "JavaScript: The Good Parts", author: "Douglas Crockford", isbn: "978-0596517748", category: "Programming", quantity: 3, available: 3, location: "Shelf G1" },
  { title: "Learning React", author: "Alex Banks", isbn: "978-1492044840", category: "Web Development", quantity: 4, available: 4, location: "Shelf G2" },
  { title: "The Road to Learn React", author: "Robin Wieruch", isbn: "978-1094073383", category: "Web Development", quantity: 2, available: 2, location: "Shelf G2" },
  { title: "Node.js Design Patterns", author: "Mario Casciaro", isbn: "978-1839214110", category: "Web Development", quantity: 3, available: 3, location: "Shelf G2" },
  { title: "Cracking the Coding Interview", author: "Gayle McDowell", isbn: "978-0984782857", category: "Placements", quantity: 10, available: 10, location: "Shelf H1" },
  { title: "Grokking Algorithms", author: "Aditya Bhargava", isbn: "978-1617292231", category: "Placements", quantity: 5, available: 5, location: "Shelf H1" },
  { title: "The Selfish Gene", author: "Richard Dawkins", isbn: "978-0198788607", category: "Biology", quantity: 2, available: 2, location: "Shelf F1" },
  { title: "Sapiens", author: "Yuval Noah Harari", isbn: "978-0062316097", category: "History", quantity: 4, available: 4, location: "Shelf F2" }
];

export async function GET() {
  try {
    await connectToDatabase();
    await Book.deleteMany({}); // Optional: Clear existing
    await Book.insertMany(sampleBooks);
    return NextResponse.json({ success: true, message: "Library seeded with 25 books" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
