import mongoose from 'mongoose';

const hrSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  staffId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dob: { type: Date },
  dateOfJoining: { type: Date, required: true },
  address: { type: String },
  role: { type: String, default: "HR" },
  password: { type: String, required: true },   // ✅ Added password field
}, {
  timestamps: true
});

export default mongoose.models.HR || mongoose.model('HR', hrSchema);
