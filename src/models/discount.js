import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  reason: { type: String, required: true },
  amount: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.models.Discount || mongoose.model('Discount', discountSchema);
