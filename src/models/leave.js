import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'role',
    required: true,
  },
  role: {
    type: String,
    enum: ['HOD', 'Teacher', 'Staff', 'Admin'],
    required: true,
    default: 'Staff'
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  type: { type: String, enum: ['Sick', 'Casual', 'Other'], required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  appliedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Leave || mongoose.model('Leave', leaveSchema);
