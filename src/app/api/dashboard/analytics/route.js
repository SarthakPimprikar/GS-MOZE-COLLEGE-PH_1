import { connectToDatabase } from "@/app/lib/mongodb"
import { NextResponse } from "next/server"
import Admission from "@/app/models/admissionSchema"

export async function GET(request) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(request.url)
    const view = searchParams.get("view") || "monthly" // 'monthly' or 'yearly'
    const year = searchParams.get("year") || new Date().getFullYear().toString()

    let pipeline = []

    if (view === "monthly") {
      // Monthly aggregation for the specified year
      pipeline = [
        {
          $match: {
            createdAt: {
              $gte: new Date(`${year}-01-01`),
              $lt: new Date(`${Number.parseInt(year) + 1}-01-01`),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
            approved: {
              $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
            },
            inProcess: {
              $sum: { $cond: [{ $eq: ["$status", "inProcess"] }, 1, 0] },
            },
            rejected: {
              $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
            },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]
    } else {
      // Yearly aggregation
      pipeline = [
        {
          $group: {
            _id: { year: { $year: "$createdAt" } },
            count: { $sum: 1 },
            approved: {
              $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
            },
            inProcess: {
              $sum: { $cond: [{ $eq: ["$status", "inProcess"] }, 1, 0] },
            },
            rejected: {
              $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
            },
          },
        },
        {
          $sort: { "_id.year": 1 },
        },
      ]
    }

    const results = await Admission.aggregate(pipeline)

    // Format data for frontend
    const formattedData = results.map((item) => {
      if (view === "monthly") {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return {
          period: monthNames[item._id.month - 1],
          year: item._id.year,
          month: item._id.month,
          total: item.count,
          approved: item.approved,
          inProcess: item.inProcess,
          rejected: item.rejected,
        }
      } else {
        return {
          period: item._id.year.toString(),
          year: item._id.year,
          total: item.count,
          approved: item.approved,
          inProcess: item.inProcess,
          rejected: item.rejected,
        }
      }
    })

    // Get summary statistics
    const totalAdmissions = formattedData.reduce((sum, item) => sum + item.total, 0)
    const avgPerPeriod = formattedData.length > 0 ? Math.round(totalAdmissions / formattedData.length) : 0
    const peakPeriod = formattedData.reduce((max, item) => (item.total > max.total ? item : max), {
      total: 0,
      period: "N/A",
    })

    return NextResponse.json({
      data: formattedData,
      summary: {
        total: totalAdmissions,
        average: avgPerPeriod,
        peak: {
          period: peakPeriod.period,
          count: peakPeriod.total,
        },
      },
      view,
      year: Number.parseInt(year),
    })
  } catch (error) {
    console.error("Admission analytics error:", error)
    return NextResponse.json({ message: "Failed to fetch admission analytics", error: error.message }, { status: 500 })
  }
}
