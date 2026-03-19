import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  action: {
    type: String,
  },
  entity: {
    type: String,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  details: {
    type: Object, 
  },
  ipAddress: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
delete mongoose.models.Log

export default mongoose.models.Log || mongoose.model('Log', logSchema);