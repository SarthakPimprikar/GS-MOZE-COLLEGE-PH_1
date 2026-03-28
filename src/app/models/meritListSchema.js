import mongoose from 'mongoose';

const meritListSchema = new mongoose.Schema({
  admissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admission',
    required: true
  },
  studentName: String,
  course: String,
  meritScore: {
    type: Number,
    required: true
  },
  rank: Number,
  category: String,
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending'
  },
  academicYear: String,
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export default mongoose.models.MeritList || mongoose.model('MeritList', meritListSchema);
