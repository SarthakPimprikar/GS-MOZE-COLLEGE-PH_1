//GET handler to fetch all user data and show it on admin dashboard

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb'; // Adjust path if needed
import userSchema from '../../models/userSchema'; // Adjust path if needed

export async function GET(req) {
    try {
        await connectToDatabase();

        // Fetch all users, exclude password and sensitive tokens
        const users = await userSchema.find({}, 
            '-password -resetPasswordToken -resetPasswordExpires -otpCode -otpExpires');

        return NextResponse.json({
            success: true,
            users
        }, { 
            status: 200 
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({
            success: false,
            message: 'Server error while fetching users'
        }, { 
            status: 500 
        });
    }
}