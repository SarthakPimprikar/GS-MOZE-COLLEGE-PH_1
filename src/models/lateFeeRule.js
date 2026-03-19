import mongoose from 'mongoose';

const lateFeeRuleSchema = new mongoose.Schema({
  daysLate: { type: Number, required: true },
  fineAmount: { type: Number, required: true },
  fineType: { type: String, enum: ['fixed', 'per_day'], default: 'fixed' },
  description: { type: String }
}, { timestamps: true });

export default mongoose.models.LateFeeRule || mongoose.model('LateFeeRule', lateFeeRuleSchema);
