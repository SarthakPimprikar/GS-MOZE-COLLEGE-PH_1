import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
  name: { type: String, required: true },     // e.g. "Mid-Term Exam"
  type: {
    type: String,
    enum: ['Internal', 'External', 'Assignment', 'Quiz', 'Lab', 'Project', 'Seminar', 'Other'],
    required: true
  },
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  academicYear: { type: String, required: true },

  maxMarks: { type: Number, required: true },
  threshold: { type: Number, default: 60 }, // % threshold for CO attainment (60% default)
  weightage: { type: Number, default: 100 }, // % weightage of this assessment in CO attainment

  // CO-question mapping: each question maps to one or more COs
  questionCOMap: [{
    questionNo: { type: String },
    maxMarks: { type: Number },
    coIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CourseOutcome' }],
    coCodes: [{ type: String }], // denormalized
  }],

  conductedDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

assessmentSchema.index({ subjectCode: 1, academicYear: 1, type: 1 });

export default mongoose.models.Assessment ||
  mongoose.model('Assessment', assessmentSchema);
