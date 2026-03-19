import mongoose from 'mongoose';

const programSpecificOutcomeSchema = new mongoose.Schema({
  code: { type: String, required: true }, // e.g. PSO1, PSO2
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String, required: true }, // Computer Science, Mechanical, etc.
  programType: { type: String, default: 'UG' },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

programSpecificOutcomeSchema.index({ code: 1, department: 1, branchId: 1 }, { unique: true });

export default mongoose.models.ProgramSpecificOutcome ||
  mongoose.model('ProgramSpecificOutcome', programSpecificOutcomeSchema);
