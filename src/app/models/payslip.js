import mongoose from 'mongoose';

const payslipSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  earnings: {
    basic: Number,
    hra: Number,
    da: Number,
    specialallowance: Number,
    bonus: Number,
    grossEarnings: Number,
  },
  deductions: {
    pf: Number,
    tds: Number,
    loan: Number,
    leave: Number,
    other: Number,
  },
  totalDeductions: Number,
  netSalary: Number,
  paymentStatus: String,
  dateOfIssue: Date,
});

export default mongoose.models.Payslip || mongoose.model('Payslip', payslipSchema);
