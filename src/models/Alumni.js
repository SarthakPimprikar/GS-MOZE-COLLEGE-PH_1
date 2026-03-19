import mongoose from 'mongoose';

const alumniSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  graduationYear: {
    type: Number,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    default: 'B.E.'
  },
  currentCompany: {
    type: String,
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  linkedInProfile: {
    type: String,
    trim: true
  },
  achievements: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Pending Verification', 'Inactive'],
    default: 'Active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Alumni = mongoose.models.Alumni || mongoose.model('Alumni', alumniSchema);

export default Alumni;
