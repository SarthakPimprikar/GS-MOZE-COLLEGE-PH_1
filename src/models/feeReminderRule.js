import mongoose from 'mongoose';

const feeReminderRuleSchema = new mongoose.Schema({
  daysBefore: { type: Number, default: 0 },
  daysAfter: { type: Number, default: 0 },
  message: { type: String, required: true },
  repeat: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.FeeReminderRule || mongoose.model('FeeReminderRule', feeReminderRuleSchema);
