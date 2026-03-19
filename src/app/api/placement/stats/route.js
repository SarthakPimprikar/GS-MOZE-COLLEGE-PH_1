import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/mongodb';
import PlacementApplication from '@/models/PlacementApplication';
import PlacementDrive from '@/models/PlacementDrive';
import Company from '@/models/Company';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Total Connected Companies
    const totalCompanies = await Company.countDocuments();
    
    // Total Drives (All time)
    const totalDrives = await PlacementDrive.countDocuments();
    
    // Placed Students count (Any application marked as Offer Accepted or Selected)
    const placedStudents = await PlacementApplication.countDocuments({
      status: { $in: ['Selected', 'Offer Accepted'] }
    });
    
    // Highest CTC & Average calculation
    const acceptedOffers = await PlacementApplication.find({
      status: { $in: ['Selected', 'Offer Accepted'] },
      'offerDetails.offeredCTC': { $exists: true }
    });
    
    let highestCTC = 0;
    let totalCTC = 0;
    
    acceptedOffers.forEach(offer => {
      const ctc = offer.offerDetails.offeredCTC || 0;
      if (ctc > highestCTC) highestCTC = ctc;
      totalCTC += ctc;
    });
    
    const averageCTC = acceptedOffers.length > 0 ? (totalCTC / acceptedOffers.length) : 0;
    
    // Top Recruiters Pipeline
    const topRecruiters = await Company.find({})
      .sort({ totalHiresHistorically: -1 })
      .limit(5)
      .select('name industry totalHiresHistorically logoUrl');
      
    // Upcoming Drives
    const upcomingDrives = await PlacementDrive.find({ status: 'Upcoming' })
      .populate('companyId', 'name logoUrl')
      .sort({ driveDate: 1 })
      .limit(5);

    return NextResponse.json({ 
      success: true, 
      data: {
        metrics: {
          totalCompanies,
          totalDrives,
          placedStudents,
          highestCTC,
          averageCTC
        },
        topRecruiters,
        upcomingDrives
      }
    });
  } catch (error) {
    console.error('Placement Stats GET Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
