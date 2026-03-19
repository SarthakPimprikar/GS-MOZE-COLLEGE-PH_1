// /models/user.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: 'student',
    },

    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
    },

    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'faculty',
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
delete mongoose.models.User
export default mongoose.models.User || mongoose.model('User', userSchema);
