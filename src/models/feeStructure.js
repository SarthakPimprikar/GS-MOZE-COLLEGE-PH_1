// models/feeStructure.js
import mongoose from 'mongoose';

const feeStructureSchema = new mongoose.Schema({
  course: {
    type: String,
    required: true,
    default: 'B.E.'
  },
  category: {
    type: String,
    required: true,
    enum: ['General', 'OBC', 'SC', 'ST']
  },
  class: {
    type: String,
    required: true,
    enum: ['FE', 'SE', 'TE', 'BE']
  },
  department: {
    type: String,
    required: true,
    enum: ['Comp', 'Mech', 'Civil', 'E&TC']
  },
  fee: {
    tuitionFee: { type: Number, required: true },
    libraryFee: { type: Number, required: true },
    developmentFee: { type: Number, required: true },
    examFee: { type: Number, required: true }
  },
  totalFee: {
    type: Number,
    required: true
  }
});

export const FeeStructure = mongoose.models.FeeStructure || mongoose.model('FeeStructure', feeStructureSchema);
