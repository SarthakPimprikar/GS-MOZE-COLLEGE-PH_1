// models/EmailVerification.js
import mongoose from 'mongoose';

const emailVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  formSessionId: String // Optional: for tracking form sessions
});
delete mongoose.models.EmailVerification
// Auto-delete expired verifications
emailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.EmailVerification || mongoose.model('EmailVerification', emailVerificationSchema);