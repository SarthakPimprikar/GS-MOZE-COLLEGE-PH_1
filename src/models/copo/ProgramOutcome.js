import mongoose from 'mongoose';

const programOutcomeSchema = new mongoose.Schema({
  code: { type: String, required: true }, // e.g. PO1, PO2
  title: { type: String, required: true }, // e.g. 'Engineering Knowledge'
  description: { type: String, required: true },
  isNBAStandard: { type: Boolean, default: true },
  programType: { type: String, default: 'UG' }, // UG | PG | Diploma
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null }, // null = global
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

programOutcomeSchema.index({ code: 1, branchId: 1 }, { unique: true });

export default mongoose.models.ProgramOutcome ||
  mongoose.model('ProgramOutcome', programOutcomeSchema);
