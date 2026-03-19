import { connectToDatabase } from "@/app/lib/mongodb";
import Teacher from "@/app/models/teacherSchema";
import User from "@/app/models/userSchema";
import staffSchema from '@/models/staff';
import AttendanceRecord from "@/app/models/attendanceRecordSchema";

export async function GET(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || new Date().toISOString().slice(0, 10);

  try {
    // Fetch all teachers/HODs
    const teachers = await Teacher.find({}, "fullName role department").lean();

    // Fetch staff from User collection
    const userStaff = await User.find({ role: "staff" }, "fullName role department").lean();

    // Fetch staff from staffSchema collection
    const staffCollection = await staffSchema.find({}, "name designation staffId department").lean();

    // Merge all staff into uniform format
    const allStaff = [
      ...userStaff.map(s => ({ 
        _id: s._id, 
        fullName: s.fullName, 
        role: "Staff",
        department: s.department || ""
      })),
      ...staffCollection.map(s => ({ 
        _id: s._id, 
        fullName: s.name, 
        role: "Staff",
        department: s.department || ""
      })),
    ];

    // Merge all users together
    const allUsers = [
      ...teachers.map(t => ({ 
        _id: t._id, 
        fullName: t.fullName, 
        role: t.role === "hod" ? "HOD" : "Teacher",
        department: t.department || ""
      })),
      ...allStaff,
    ];

    // Fetch saved attendance for the date
    const attendanceRecords = await AttendanceRecord.find({ date }).lean();

    // Merge attendance status into users
    const users = allUsers.map(u => {
      const record = attendanceRecords.find(a => a.staffId.toString() === u._id.toString());
      return {
        ...u,
        attendanceStatus: record?.status || "Absent",
        remarks: record?.remarks || ""
      };
    });

    return new Response(JSON.stringify({ users }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch attendance" }), { status: 500 });
  }
}

export async function POST(req) {
  await connectToDatabase();

  try {
    const { staffId, date, status, remarks } = await req.json();

    if (!staffId || !date || !status) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Try to find the user in Teacher collection
    let user = await Teacher.findById(staffId).lean();
    let role = user ? (user.role === "hod" ? "HOD" : "Teacher") : null;

    // If not found, try in User collection
    if (!role) {
      user = await User.findById(staffId).lean();
      role = user?.role === "staff" ? "Staff" : null;
    }

    // If not found, try in staffSchema collection
    if (!role) {
      user = await staffSchema.findById(staffId).lean();
      role = user ? "Staff" : null;
    }

    if (!user || !role) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Upsert attendance (create or update)
    await AttendanceRecord.findOneAndUpdate(
      { staffId, date },
      { staffId, role, date, status, remarks: remarks || "" },
      { upsert: true, new: true }
    );

    return new Response(JSON.stringify({ message: "Attendance updated" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to update attendance" }), { status: 500 });
  }
}
