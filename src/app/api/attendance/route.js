import { connectToDatabase } from "@/app/lib/mongodb";
import Teacher from "@/app/models/teacherSchema";
import User from "@/app/models/userSchema";
import staffSchema from '@/models/staff';
import AttendanceRecord from "@/app/models/attendanceRecordSchema";

export async function GET(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const userIdFilter = searchParams.get("userId");

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

    // Fetch saved attendance
    let query = {};
    if (userIdFilter) {
      query.staffId = userIdFilter;
    } else {
      query.date = date || new Date().toISOString().slice(0, 10);
    }

    const attendanceRecords = await AttendanceRecord.find(query).lean();

    // If filtering by user, return all for that user
    if (userIdFilter) {
       return new Response(JSON.stringify({ data: attendanceRecords }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Merge attendance status into users (Existing logic for daily view)
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

    // Try to find the user and their role across different collections
    let user = null;
    let role = null;

    // 1. Try Teacher/HOD
    user = await Teacher.findById(staffId).lean();
    if (user) {
      role = user.role?.toLowerCase() === "hod" ? "HOD" : "Teacher";
    }

    // 2. Try User (Staff/Admin)
    if (!role) {
      user = await User.findById(staffId).lean();
      if (user) {
        if (user.role?.toLowerCase() === "staff") role = "Staff";
        else if (user.role?.toLowerCase() === "admin") role = "Admin";
        else role = "Staff"; // Default for other user roles being tracked
      }
    }

    // 3. Try staffSchema (Alternative staff collection)
    if (!role) {
      user = await staffSchema.findById(staffId).lean();
      if (user) role = "Staff";
    }

    if (!role) {
      return new Response(JSON.stringify({ error: "User or Role not found" }), { status: 404 });
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
