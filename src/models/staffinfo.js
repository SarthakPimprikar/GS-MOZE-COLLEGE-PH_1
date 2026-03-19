import mongoose from 'mongoose';

const staffInfoSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  joiningDate: { type: Date, default: Date.now },
  
  currentSalary: {
    base: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    effectiveFrom: { type: Date }
  },
  
  leaveBalance: {
    sick: { type: Number, default: 10 },
    casual: { type: Number, default: 10 },
    other: { type: Number, default: 5 }
  },
  
  leaves: [{
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, required: true },
    type: { type: String, enum: ['Sick', 'Casual', 'Other'], required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    appliedAt: { type: Date, default: Date.now }
  }],
  
  salaryHistory: [{
    base: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    leaveDeduction: { type: Number, default: 0 },
    effectiveFrom: { type: Date, required: true },
    changedAt: { type: Date, default: Date.now }
  }],
  
  payslips: [{
    month: { type: String, required: true },
    year: { type: Number, required: true },
    dateOfIssue: { type: Date, default: Date.now },
    earnings: {
      basic: Number,
      hra: Number,
      da: Number,
      specialAllowance: Number,
      bonus: Number,
      other: Number
    },
    deductions: {
      pf: Number,
      tds: Number,
      loan: Number,
      leave: Number,
      other: Number
    },
    grossEarnings: Number,
    totalDeductions: Number,
    netSalary: Number,
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending'],
      default: 'Pending'
    }
  }]
}, { timestamps: true });

export default mongoose.models.StaffInfo || mongoose.model('StaffInfo', staffInfoSchema);