import mongoose, { Schema } from 'mongoose';

const attendanceSchema = new Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Leave'],
    required: true
  },
  remarks: {
    type: String,
    default: ''
  }
}, { timestamps: true });

export default mongoose.models.AttendanceStaff || mongoose.model('AttendanceStaff', attendanceSchema);
