import mongoose from 'mongoose';

const holidaySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ['Public', 'Internal', 'Other'],
    default: 'Public',
  },
  description: {
    type: String,
    default: '',
  }
}, { timestamps: true });

export default mongoose.models.Holiday || mongoose.model('Holiday', holidaySchema);
