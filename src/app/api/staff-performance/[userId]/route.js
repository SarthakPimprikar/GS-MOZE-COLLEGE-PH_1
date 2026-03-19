// src/app/api/staff-performance/[userId]/route.js
import { connectToDatabase } from "@/app/lib/mongodb";
import Enquiry from "../../../models/enquirySchema";
import Admission from "../../../models/admissionSchema";

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

    return Response.json({
      totalEnquiries,
      convertedEnquiries,
      admissionApplications,
      recentEnquiries,
    });
  } catch (error) {
    console.error("Error fetching staff performance:", error);
    return Response.json(
      { error: "Failed to fetch performance data" },
      { status: 500 }
    );
  }
}