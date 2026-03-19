import mongoose from 'mongoose';

const paymentComponentSchema = new mongoose.Schema({
  componentName: {
    type: String,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    required: true,
    default: 0
  },
  balanceAmount: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['Paid', 'Partial', 'Unpaid'],
    default: 'Unpaid'
  },
  isWelfare: {
    type: Boolean,
    default: false
  }
});

const paymentTrackingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admission', // Changed from Student to Admission
    required: true
  },
  admissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admission',
    required: true
  },
  receiptNumber: {
    type: String,
    required: true,
    unique: true
  },
  feeStructure: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeeStructure',
    required: true
  },
  paymentComponents: [paymentComponentSchema],
  totalFees: {
    type: Number,
    required: true
  },
  totalPaid: {
    type: Number,
    required: true
  },
  totalBalance: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Online', 'UPI', 'Bank Transfer', 'Cheque', 'Credit Card', 'Debit Card'],
    required: true
  },
  remarks: {
    type: String,
    default: ''
  },
  academicYear: {
    type: String,
    required: true,
    default: '2025-2026'
  },
  status: {
    type: String,
    enum: ['Paid', 'Partial', 'Unpaid'],
    default: 'Partial'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Pre-save hook to calculate totals
paymentTrackingSchema.pre('save', function (next) {
  if (this.isModified('paymentComponents')) {
    // Calculate total paid and balance
    this.totalPaid = this.paymentComponents.reduce((sum, component) => sum + component.paidAmount, 0);
    this.totalBalance = this.totalFees - this.totalPaid;

    // Update overall status
    if (this.totalBalance === 0) {
      this.status = 'Paid';
    } else if (this.totalPaid > 0) {
      this.status = 'Partial';
    } else {
      this.status = 'Unpaid';
    }
  }
  next();
});

// Index for efficient queries
paymentTrackingSchema.index({ student: 1, academicYear: 1 });
paymentTrackingSchema.index({ status: 1 });
paymentTrackingSchema.index({ createdAt: -1 });
delete mongoose.models.PaymentTracking
const PaymentTracking = mongoose.models.PaymentTracking || mongoose.model('PaymentTracking', paymentTrackingSchema);

export default PaymentTracking;
