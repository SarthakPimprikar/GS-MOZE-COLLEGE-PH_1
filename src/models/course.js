import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  duration: {
    type: Number, // in months or years (decide as per your use case)
    required: true
  },
  department: {
    type: String,
    required: true
  },
  semesterCount: {
    type: Number,
    default: 8
  }
}, {
  timestamps: true
});

export default mongoose.models.Course || mongoose.model('Course', courseSchema);
