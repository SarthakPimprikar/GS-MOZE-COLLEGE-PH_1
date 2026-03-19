import { connectToDatabase } from "@/app/lib/mongodb";
import Enquiry from "@/app/models/enquirySchema";
import Admission from "@/app/models/admissionSchema";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("staffId"); // coming from frontend

    if (!staffId) {
      return Response.json({ error: "Staff ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const totalEnquiries = await Enquiry.countDocuments({ counsellorId: staffId });

    const pendingEnquiries = await Enquiry.countDocuments({
      counsellorId: staffId,
      status: "Pending",
    });

    const approvedEnquiries = await Enquiry.countDocuments({
      counsellorId: staffId,
      status: "Converted", // or "Approved"
    });

    const leavesCount = await Admission.countDocuments({
      counsellorId: staffId,
      leaveStatus: "Approved", // adjust to your field
    });

    const recentEnquiries = await Enquiry.find({ counsellorId: staffId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("first last courseInterested status createdAt");

    return Response.json({
      totalEnquiries,
      pendingEnquiries,
      approvedEnquiries,
      leavesCount,
      recentEnquiries,
    });
  } catch (error) {
    console.error("Error fetching staff dashboard data:", error);
    return Response.json(
      { error: "Failed to fetch staff dashboard data" },
      { status: 500 }
    );
  }
}
