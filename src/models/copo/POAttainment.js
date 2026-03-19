import mongoose from 'mongoose';

const poAttainmentSchema = new mongoose.Schema({
  poId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProgramOutcome', required: true },
  poCode: { type: String },          // e.g. PO1
  targetType: { type: String, enum: ['PO', 'PSO'], default: 'PO' },

  department: { type: String, required: true },
  programType: { type: String, default: 'UG' },
  academicYear: { type: String, required: true },
  semester: { type: Number },
  batch: { type: String },

  attainmentPercentage: { type: Number, default: 0 }, // Weighted aggregation result

  // Contribution from each CO
  coContributions: [{
    coId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseOutcome' },
    coCode: { type: String },
    subjectCode: { type: String },
    coAttainment: { type: Number },
    mappingLevel: { type: Number }, // 1, 2, or 3
    weightedContribution: { type: Number },
  }],

  // Formula: Σ(CO% × level) / Σ(level)
  formulaSnapshot: { type: String, default: 'Σ(CO% × level) / Σ(level)' },
  calculatedAt: { type: Date, default: Date.now },
  calculatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null },
}, { timestamps: true });

poAttainmentSchema.index({ poId: 1, department: 1, academicYear: 1 }, { unique: true });

export default mongoose.models.POAttainment ||
  mongoose.model('POAttainment', poAttainmentSchema);
