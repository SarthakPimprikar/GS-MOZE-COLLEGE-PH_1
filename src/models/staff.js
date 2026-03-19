import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  staffId: { type: String, required: true, unique: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  salary: { type: Number, required: true },
  joiningDate: { type: Date, default: Date.now },
  leaveCount: { type: Number, default: 0 },

});

export default mongoose.models.Staff || mongoose.model('Staff', staffSchema);
