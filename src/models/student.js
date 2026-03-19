import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  //_id: mongoose.Schema.Types.ObjectId,
  studentId: {
    type: String,
    //ref: 'Student', // optional, if referencing the Student model
    required: true,
    unique: true
  },
  name: { 
    type: String, 
    required: true },
  rollNumber: { 
    type: String, 
    required: true, 
    unique: true },
  gender: { 
    type: String, 
    enum: ['Male', 'Female', 'Other'], 
    required: true },
  dob: { 
    type: Date, 
    required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true },
  phone: { type: String },
  department: { 
    type: String, 
    enum: ['Comp', 'Mech', 'Civil', 'E&TC'],
    required: true },
  course: {
    type: String,
    required: true,
    default: 'B.E.'
  },
  class: {
  type: String,
  enum: ['FE', 'SE', 'TE', 'BE'],
  required: true
  },
  semester: { type: Number },
  enrollmentDate: { type: Date, default: Date.now },
  category: {
    type: String,
    enum: ['General', 'OBC', 'SC','ST', 'EWS', 'Other'], // ✅ Category added
    default: 'General'
  }
}, {
  timestamps: true
});

export default mongoose.models.Student || mongoose.model("Student", studentSchema);
