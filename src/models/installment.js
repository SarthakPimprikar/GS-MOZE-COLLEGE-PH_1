//models/installment.js

import mongoose from 'mongoose';

const installmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  isInstallmentAllowed: {
    type: Boolean,
    default: false
  },
  totalFee: {
    type: Number,
    required: true
  },
  breakdown: [
    {
      amount: Number,
      dueDate: Date,
      isPaid: {
        type: Boolean,
        default: false
      },
      paidDate: Date
    }
  ]
}, {
  timestamps: true
});

export default mongoose.models.InstallmentPlan || mongoose.model('InstallmentPlan', installmentSchema);
