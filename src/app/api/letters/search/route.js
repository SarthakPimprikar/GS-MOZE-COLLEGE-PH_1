import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Student from "@/app/models/studentSchema";
import Teacher from "@/app/models/teacherSchema";
import User from "@/app/models/userSchema";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) return NextResponse.json({ success: true, users: [] });

    const searchFilter = { 
      email: { $regex: query, $options: "i" } 
    };

    // 1. Search in Students
    const students = await Student.find(searchFilter, "fullName email branch currentYear role").limit(5).lean();
    
    // 2. Search in Teachers/HODs
    const teachers = await Teacher.find(searchFilter, "fullName email department role").limit(5).lean();
    
    // 3. Search in User (Staff/Admin/Prospective Students)
    const users = await User.find(searchFilter, "fullName email department role").limit(5).lean();

    // Merge and format
    const results = [
      ...students.map(s => ({ ...s, id: s._id, role: "Student" })),
      ...teachers.map(t => ({ ...t, id: t._id, role: t.role.toUpperCase() })),
      ...users.map(u => ({ ...u, id: u._id, role: u.role.charAt(0).toUpperCase() + u.role.slice(1) }))
    ];

    // Remove duplicates by ID
    const uniqueResults = results.filter((v, i, a) => a.findIndex(t => (t.id.toString() === v.id.toString())) === i);

    return NextResponse.json({ success: true, users: uniqueResults });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
