import mongoose from "mongoose";
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide your full name"],
    },

    email: {
      type: String,
      required: [true, "Please provide an email address"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
    },

    role: {
      type: String,
      default: "student",
    },

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    lastLogin: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    otpCode: String,
    otpExpires: Date,

    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "role",
    },

    sessionToken: String,

    // --- STAFF FIELDS ---
    staffId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents to have null/undefined staffId
    },
    designation: String,
    department: String,
    salary: Number,
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    leaveCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.user) {
  delete mongoose.models.user;
}

const user = mongoose.models.user || mongoose.model("user", userSchema);

export default user;
