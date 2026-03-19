import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  staffId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  dob: {
    type: Date
  },
  dateOfJoining: {
    type: Date,
    required: true
  },
  role: {
    type: String,
    default: "Admin"
  },
  password:{
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Admin || mongoose.model('Admin', adminSchema);
