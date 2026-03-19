import mongoose from 'mongoose';

// A single document stores the entire CO-PO mapping for a subject+year
const copoMappingSchema = new mongoose.Schema({
  subjectCode: { type: String, required: true },
  subjectName: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  academicYear: { type: String, required: true },
  
  // Matrix: array of { coId, poId/psoId, level }
  mappings: [{
    coId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseOutcome', required: true },
    coCode: { type: String },           // denormalized for display
    targetType: { type: String, enum: ['PO', 'PSO'], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true }, // PO or PSO id
    targetCode: { type: String },        // e.g. PO1, PSO2
    level: { type: Number, enum: [0, 1, 2, 3], default: 0 }, // 0 = not mapped
  }],

  // Approval flow
  status: { type: String, enum: ['draft', 'submitted', 'approved', 'rejected'], default: 'draft' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  approvedAt: { type: Date, default: null },
  rejectionReason: { type: String, default: '' },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null },
}, { timestamps: true });

copoMappingSchema.index({ subjectCode: 1, academicYear: 1 }, { unique: true });

export default mongoose.models.COPOMapping ||
  mongoose.model('COPOMapping', copoMappingSchema);
