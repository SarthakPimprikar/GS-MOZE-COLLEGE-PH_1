import { NextResponse } from "next/server";
import { ElectionDuty, PaperPublication, COffRequest } from "@/models/Talent";
import teacher from "@/app/models/teacherSchema";
import { connectToDatabase } from "@/app/lib/mongodb";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const department = searchParams.get("department");
    
    let teacherQuery = { role: { $in: ["teacher", "hod"] } };
    if (department) {
      teacherQuery.department = department;
    }
    
    const teachers = await teacher.find(teacherQuery).select("fullName role department");
    
    const matrix = await Promise.all(teachers.map(async (t) => {
      const dutiesCount = await ElectionDuty.countDocuments({ teacherId: t._id, status: "Completed" });
      const pubCount = await PaperPublication.countDocuments({ teacherId: t._id, status: "Published" });
      const coffBalance = await COffRequest.countDocuments({ teacherId: t._id, status: "Approved" });
      
      return {
        _id: t._id,
        name: t.fullName,
        role: t.role,
        department: t.department,
        metrics: {
          electionDuty: dutiesCount,
          publications: pubCount,
          coffBalance: coffBalance,
          performanceScore: (dutiesCount * 10) + (pubCount * 20) // Example score
        }
      };
    }));
    
    return NextResponse.json({ success: true, data: matrix });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
