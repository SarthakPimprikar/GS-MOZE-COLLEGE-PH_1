import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { FeeReceipt } from '@/models/feeReceipt';
import FeeStructure from '@/app/models/feeStructureSchema';

export async function GET() {
    await connectToDatabase();

    try {
        // 1. Total Collections (Sum of all fee receipts)
        const totalCollectionsResult = await FeeReceipt.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amountPaid" }
                }
            }
        ]);
        const totalCollections = totalCollectionsResult[0]?.total || 0;

        // 2. Active Structures Count
        const activeStructures = await FeeStructure.countDocuments({ isActive: true });

        // 3. Total Potential Value (Sum of totalFees from all structures)
        const totalStructureValueResult = await FeeStructure.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalFees" }
                }
            }
        ]);
        const totalStructureValue = totalStructureValueResult[0]?.total || 0;

        return NextResponse.json({
            success: true,
            data: {
                totalCollections,
                activeStructures,
                totalStructureValue,
                pendingFees: 0 // Placeholder
            }
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
