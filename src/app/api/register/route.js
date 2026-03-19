//POST handler to register user

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import User from '../../models/userSchema';
import teacherSchema from '../../models/teacherSchema';
import bcrypt from 'bcryptjs'; // If you want to hash passwords
import { logUserAction } from '@/app/lib/logger';
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      role,
      department,
      teacherId
    } = body;

    // Ensure role is selected
    if (!role) {
      return NextResponse.json({ error: 'Role is required' }, { status: 400 });
    }

    // ✅ If role is Teacher, register in Teacher model
    if (role === 'teacher') {
      if (!fullName || !email || !phone || !department || !teacherId || !password || !confirmPassword) {
        return NextResponse.json({
          error: 'All teacher fields are required'
        }, {
          status: 400
        });
      }

      if (password !== confirmPassword) {
        return NextResponse.json({
          error: 'Passwords do not match'
        }, {
          status: 400
        });
      }

      const existing = await teacherSchema.findOne({
        $or: [{ email }, { teacherId }]
      });

      if (existing) {
        return NextResponse.json({
          error: 'Teacher already exists with this email or teacherId'
        }, {
          status: 409
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10); // 🔐 Hashing password

      const newTeacher = await teacherSchema.create({
        fullName,
        email,
        phone,
        department,
        teacherId,
        role,
        password: hashedPassword,
      });

      await logUserAction({
        userId: 'admin',
        action: 'created_user',
        entity: 'user',
      });
      return NextResponse.json({
        message: 'Teacher registered successfully'
      }, {
        status: 201
      });
    }

    // ✅ If role is HOD, register in Teacher model with null department
    if (role === 'hod') {
      if (!fullName || !email || !phone || !teacherId || !password || !confirmPassword) {
        return NextResponse.json({ error: 'All HOD fields are required (department not required)' }, { status: 400 });
      }

      if (password !== confirmPassword) {
        return NextResponse.json({
          error: 'Passwords do not match'
        }, {
          status: 400
        });
      }

      const existing = await teacherSchema.findOne({
        $or: [{ email }, { teacherId }]
      });

      if (existing) {
        return NextResponse.json({
          error: 'HOD already exists'
        }, {
          status: 409
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10); // 🔐 Hashing password

      const newHOD = await teacherSchema.create({
        fullName,
        email,
        phone,
        department: null, // Set department to null for HOD
        teacherId,
        role,
        password: hashedPassword,
      });
      await logUserAction({
        userId: 'admin',
        action: 'created_user',
        entity: 'user',
      });
      return NextResponse.json({ message: 'HOD registered successfully' }, { status: 201 });
    }

    // ✅ Handle normal User registration for other roles
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      return NextResponse.json({
        error: 'All fields are required'
      }, {
        status: 400
      });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({
        error: 'Passwords do not match'
      }, {
        status: 400
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({
        error: 'User already exists'
      }, {
        status: 409
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
      roleId: body.roleId,
    });
    await logUserAction({
      userId: 'admin',
      action: 'created_user',
      entity: 'user',
    });
    return NextResponse.json({
      message: 'User registered successfully'
    }, {
      status: 201
    });
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({
      error: 'Internal Server Error'
    }, {
      status: 500
    });
  }
}