import mongoose from 'mongoose';

const coAttainmentSchema = new mongoose.Schema({
  coId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseOutcome', required: true },
  coCode: { type: String },
  subjectCode: { type: String, required: true },
  subjectName: { type: String },
  department: { type: String, required: true },
  semester: { type: Number },
  academicYear: { type: String, required: true },
  batch: { type: String },

  // Calculation details
  totalStudents: { type: Number, default: 0 },
  studentsAboveThreshold: { type: Number, default: 0 },
  threshold: { type: Number, default: 60 }, // % threshold used
  attainmentPercentage: { type: Number, default: 0 }, // Final CO attainment %

  // Breakdown per assessment type
  assessmentBreakdown: [{
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
    assessmentName: { type: String },
    assessmentType: { type: String },
    average: { type: Number },
    attainment: { type: Number },
  }],

  // Snapshot of formula used (for audit)
  formulaSnapshot: { type: String, default: '(students >= threshold) / total * 100' },
  calculatedAt: { type: Date, default: Date.now },
  calculatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null },
}, { timestamps: true });

coAttainmentSchema.index({ coId: 1, academicYear: 1 }, { unique: true });
coAttainmentSchema.index({ subjectCode: 1, academicYear: 1 });

export default mongoose.models.COAttainment ||
  mongoose.model('COAttainment', coAttainmentSchema);
