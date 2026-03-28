// src/app/api/staff-performance/[userId]/route.js
import { connectToDatabase } from "@/app/lib/mongodb";
import Enquiry from "../../../models/enquirySchema";
import Admission from "../../../models/admissionSchema";
import AttendanceRecord from "@/app/models/attendanceRecordSchema";

export async function GET(request, { params }) {
  const { userId } = params;

  try {
    await connectToDatabase();

    // Get total enquiries assigned to this staff member
    const totalEnquiries = await Enquiry.countDocuments({
      counsellorId: userId,
    });

    // Get converted enquiries
    const convertedEnquiries = await Enquiry.countDocuments({
      counsellorId: userId,
      status: "Converted",
    });

    // Get admission applications associated with this staff member
    const admissionApplications = await Admission.countDocuments({
      counsellorId: userId,
    });

    // Get recent 5 enquiries
    const recentEnquiries = await Enquiry.find({
      counsellorId: userId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("first last courseInterested status");

    // NEW: Calculate Attendance Percentage
    const attendanceRecords = await AttendanceRecord.find({ staffId: userId }).lean();
    
    let attendanceRate = 0;
    if (attendanceRecords.length > 0) {
      const presentCount = attendanceRecords.filter(r => r.status === "Present").length;
      attendanceRate = ((presentCount / attendanceRecords.length) * 100).toFixed(1);
    }

    return Response.json({
      totalEnquiries,
      convertedEnquiries,
      admissionApplications,
      recentEnquiries,
      attendanceRate: parseFloat(attendanceRate) || 0,
      activeDays: attendanceRecords.length,
      tasksCompleted: convertedEnquiries, // Assuming converted enquiries are tasks
      avgRating: 4.5, // Placeholder
      recentActivity: recentEnquiries.map(e => ({
        action: `Handled enquiry for ${e.first} ${e.last}`,
        date: e.createdAt,
        status: "completed"
      }))
    });
  } catch (error) {
    console.error("Error fetching staff performance:", error);
    return Response.json(
      { error: "Failed to fetch performance data" },
      { status: 500 }
    );
  }
}