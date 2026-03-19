import mongoose from 'mongoose';

const copoAuditLogSchema = new mongoose.Schema({
  entityType: {
    type: String,
    enum: ['CourseOutcome', 'COPOMapping', 'Assessment', 'COAttainment', 'POAttainment', 'ProgramOutcome', 'ProgramSpecificOutcome'],
    required: true
  },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  action: {
    type: String,
    enum: ['created', 'updated', 'deleted', 'submitted', 'approved', 'rejected', 'calculated', 'exported'],
    required: true
  },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  performedByName: { type: String },
  role: { type: String },
  details: { type: mongoose.Schema.Types.Mixed }, // diff snapshot or description
  ipAddress: { type: String },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null },
}, { timestamps: true });

copoAuditLogSchema.index({ entityType: 1, entityId: 1 });
copoAuditLogSchema.index({ performedBy: 1 });
copoAuditLogSchema.index({ createdAt: -1 });

export default mongoose.models.COPOAuditLog ||
  mongoose.model('COPOAuditLog', copoAuditLogSchema);
