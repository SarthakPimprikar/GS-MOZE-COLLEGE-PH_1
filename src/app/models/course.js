// models/course.js
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['Engineering', 'Management', 'Diploma', 'Other'],
    required: true
  },
  duration: {
    type: String // e.g., "4 Years", "2 Years"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate course names
courseSchema.index({ name: 1 }, { unique: true });

const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
export default Course;