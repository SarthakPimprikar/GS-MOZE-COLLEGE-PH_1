import mongoose from 'mongoose';

const installmentPlanSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  installments: {
    type: [Number], // Array of installment amounts
    required: true
  },
  totalFee: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.InstallmentPlan || mongoose.model('InstallmentPlan', installmentPlanSchema);
