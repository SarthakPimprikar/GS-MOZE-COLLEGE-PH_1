import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema(
  {
    programType: {
      type: String,
      required: true,
      trim: true,
    },
    departmentName: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
    },
    caste: {
      type: String,
      enum: ["general", "obc", "sc", "st", "ews"],
      default: "general",
    },
    category: {
      type: String,
      enum: ["regular", "management", "nri", "sports", "defense"],
      default: "regular",
    },
    yearWiseFeeStructure: {
      type: String,
      enum: ["annual", "semester", "quarterly", "monthly"],
      default: "annual",
    },
    scholarshipParticular: {
      type: String,
      enum: ["none", "merit", "need", "government", "institutional", "sports", "minority"],
      default: "none",
    },
    feesFromStudent: [
      {
        componentName: { type: String, required: true, trim: true },
        amount: { type: Number, required: true, min: 0 },
        collectionOrder: { type: Number, default: 1 },
        displayOrder: { type: Number, default: 1 },
      },
    ],
    feesFromSocialWelfare: [
      {
        componentName: { type: String, required: true, trim: true },
        amount: { type: Number, required: true, min: 0 },
        collectionOrder: { type: Number, default: 1 },
        displayOrder: { type: Number, default: 1 },
      },
    ],
    totalStudentFees: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSocialWelfareFees: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalFees: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentModes: {
      cash: { type: Boolean, default: true },
      upi: { type: Boolean, default: true },
      cheque: { type: Boolean, default: true },
      bankTransfer: { type: Boolean, default: true }
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate record entries
feeStructureSchema.index(
  { programType: 1, departmentName: 1, year: 1, caste: 1, category: 1 },
  { unique: true }
);

// Auto-calculate totals before save
feeStructureSchema.pre("save", function (next) {
  // Initialize totals to 0
  this.totalStudentFees = 0;
  this.totalSocialWelfareFees = 0;
  this.totalFees = 0;

  // Calculate total student fees
  if (this.feesFromStudent && Array.isArray(this.feesFromStudent)) {
    this.totalStudentFees = this.feesFromStudent.reduce((sum, item) => {
      return sum + (Number(item.amount) || 0);
    }, 0);
  }

  // Calculate total social welfare fees
  if (this.feesFromSocialWelfare && Array.isArray(this.feesFromSocialWelfare)) {
    this.totalSocialWelfareFees = this.feesFromSocialWelfare.reduce((sum, item) => {
      return sum + (Number(item.amount) || 0);
    }, 0);
  }

  // Calculate grand total
  this.totalFees = this.totalStudentFees + this.totalSocialWelfareFees;

  // Ensure totalFees is a number and not undefined
  if (typeof this.totalFees !== "number" || isNaN(this.totalFees)) {
    this.totalFees = 0;
  }

  next();
});
delete mongoose.models.FeeStructure
// Model export
export default mongoose.models.FeeStructure ||
  mongoose.model("FeeStructure", feeStructureSchema);