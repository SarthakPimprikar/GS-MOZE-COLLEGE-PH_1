import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  scholarshipName: { type: String, required: true },
  amount: { type: Number, required: true },
  awardedOn: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Scholarship || mongoose.model('Scholarship', scholarshipSchema);
