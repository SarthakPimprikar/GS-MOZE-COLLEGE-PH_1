import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/app/lib/mongodb';
import User from '@/models/user';
import Teacher from '@/app/models/teacherSchema';


export async function POST(request) {
  await connectToDatabase();

  try {
    const { email, password } = await request.json();
    console.log(email,password)
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 1️⃣ Try User first
    let account = await User.findOne({ email });
    let accountType = 'user';

    // 2️⃣ If not found, try Teacher
    if (!account) {
      account = await Teacher.findOne({ email });
      accountType = 'teacher';
    }

    if (!account) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      );
    }

    // 3️⃣ Compare password
    const isMatch = await account.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // 4️⃣ Generate token
    const token = jwt.sign(
      { userId: account._id, role: account.role, type: accountType },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const cookieStore = cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
    });

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
