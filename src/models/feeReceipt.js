// models/feeReceipt.js
import mongoose from 'mongoose';

const feeReceiptSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admission', // Changed from Student to Admission
    required: true
  },
  admission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admission',
    required: false // Make optional for backward compatibility
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  amountPaid: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Online', 'UPI', 'Bank Transfer', 'Cheque', 'Credit Card', 'Debit Card'],
    required: true
  },
  remarks: {
    type: String
  },
  academicYear: {
    type: String,
    required: true
  }
});

export const FeeReceipt = mongoose.models.FeeReceipt || mongoose.model("FeeReceipt", feeReceiptSchema);
