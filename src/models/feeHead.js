import mongoose from 'mongoose';

const feeHeadSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.FeeHead || mongoose.model('FeeHead', feeHeadSchema);
