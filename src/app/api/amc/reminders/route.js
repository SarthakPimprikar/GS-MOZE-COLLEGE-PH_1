import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import AMC from "@/models/AMC";

export async function GET() {
  try {
    await connectToDatabase();
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Find AMCs whose renewal date is within 30 days and not yet renewed/expired
    const alerts = await AMC.find({
      renewalDate: { $lte: thirtyDaysFromNow, $gte: today },
      status: { $in: ['Active', 'Pending Renewal'] }
    }).populate('itemId', 'itemName location');

    return NextResponse.json(alerts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}
