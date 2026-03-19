import mongoose from 'mongoose';

const assessmentMarkSchema = new mongoose.Schema({
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentRollNo: { type: String },  // denormalized

  // Per-question marks (matches Assessment.questionCOMap)
  questionMarks: [{
    questionNo: { type: String },
    marksObtained: { type: Number, default: 0 },
  }],

  totalMarksObtained: { type: Number, default: 0 },
  isAbsent: { type: Boolean, default: false },

  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  source: { type: String, enum: ['manual', 'csv'], default: 'manual' },

  subjectCode: { type: String },      // denormalized for fast queries
  academicYear: { type: String },     // denormalized
}, { timestamps: true });

assessmentMarkSchema.index({ assessmentId: 1, studentId: 1 }, { unique: true });
assessmentMarkSchema.index({ subjectCode: 1, academicYear: 1 });

export default mongoose.models.AssessmentMark ||
  mongoose.model('AssessmentMark', assessmentMarkSchema);
