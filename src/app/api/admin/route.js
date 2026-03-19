import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';// adjust based on your project
import Admin from '@/models/admin'; // adjust path if needed

export async function GET() {
  try {
    await connectToDatabase();
    const admins = await Admin.find();
    return NextResponse.json(admins);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}

// POST new admin
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const newAdmin = new Admin(body);
    await newAdmin.save();

    return NextResponse.json({ message: 'Admin created successfully', admin: newAdmin }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}