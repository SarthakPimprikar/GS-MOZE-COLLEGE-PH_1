import mongoose from 'mongoose';

const BLOOMS_LEVELS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

const courseOutcomeSchema = new mongoose.Schema({
  code: { type: String, required: true },     // e.g. CO1
  statement: { type: String, required: true }, // The outcome statement
  bloomsLevel: { type: String, enum: BLOOMS_LEVELS, required: true },
  
  // Subject/Academic linkage
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  department: { type: String, required: true },
  programType: { type: String, default: 'UG' },
  semester: { type: Number, required: true },
  academicYear: { type: String, required: true }, // e.g. "2024-25"
  batch: { type: String },                        // e.g. "2022-2026"

  // Version control
  version: { type: Number, default: 1 },
  isLatest: { type: Boolean, default: true },
  previousVersionId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseOutcome', default: null },
  
  // Approval workflow
  status: { type: String, enum: ['draft', 'submitted', 'approved', 'rejected'], default: 'draft' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  approvedAt: { type: Date, default: null },
  rejectionReason: { type: String, default: '' },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

courseOutcomeSchema.index({ subjectCode: 1, academicYear: 1, isLatest: 1 });

export default mongoose.models.CourseOutcome ||
  mongoose.model('CourseOutcome', courseOutcomeSchema);
