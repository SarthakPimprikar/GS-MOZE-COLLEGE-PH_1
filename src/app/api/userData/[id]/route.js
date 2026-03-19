import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import userSchema from '../../../models/userSchema';

// PUT - Update a user by ID
export async function PUT(req, { params }) {
  const { id } = params;
  const data = await req.json();
  console.log('Update user data:', data);

  try {
    await connectToDatabase();

    // Sanitize roleId: convert empty string to null to prevent ObjectId cast error
    if (data.roleId === "") {
      data.roleId = null;
    }

    // Disallow password update here for security unless explicitly handled
    if (data.password) {
      return NextResponse.json({
        success: false,
        message: "Password update not allowed in this route."
      }, {
        status: 400
      });
    }

    // Check if email is being updated and if it already exists for another user
    if (data.email) {
      const existingUser = await userSchema.findOne({ email: data.email, _id: { $ne: id } });
      if (existingUser) {
        return NextResponse.json({
          success: false,
          message: "Email already exists for another user."
        }, {
          status: 400
        });
      }
    }

    const updatedUser = await userSchema.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
      select: '-password -resetPasswordToken -resetPasswordExpires -otpCode -otpExpires',
    });

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, {
        status: 404
      });
    }

    return NextResponse.json({
      success: true,
      user: updatedUser
    }, {
      status: 200
    });

  } catch (error) {
    console.error('Error updating user [PUT /api/userData/[id]]:', error); // Enhanced logging
    return NextResponse.json({
      success: false,
      message: error.message || 'Server error while updating user', // Return actual error message to client for debugging
    }, {
      status: 500
    });
  }
}

// DELETE - Delete a user by ID
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectToDatabase();

    const deletedUser = await userSchema.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({
        success: false,
        message: 'User not found'
      }, {
        status: 404
      });
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    }, {
      status: 200
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error while deleting user',
    }, {
      status: 500
    });
  }
}