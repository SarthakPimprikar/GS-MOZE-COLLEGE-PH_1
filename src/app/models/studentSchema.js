// //database schema for student

// import mongoose from 'mongoose';

// const studentSchema = new mongoose.Schema(
//   {
//     studentId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     admissionId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'admission',
//       required: true,
//       unique: true,
//     },
//     fullName: { type: String },
//     email: { type: String },
//     mobileNumber: { type: String },
//     dateOfBirth: { type: Date },
//     address: {
//       addressLine: String,
//       city: String,
//       state: String,
//       pincode: String,
//       country: String,
//     },
//     status: {
//       type: String,
//       enum: ['active', 'inactive', 'alumni', 'suspended'],
//       default: 'active',
//     },
//   },
//   { timestamps: true }
// );

// delete mongoose.models.student

// const student = mongoose.models.student || mongoose.model('student', studentSchema);

// export default student;

import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    admissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admission', // Fixed: lowercase to match admission model export
      required: true,
      unique: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    address: {
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    programType: { 
      type: String, 
      enum: ['Diploma', 'UG', 'PG'], 
      required: true 
    },
    branch: { type: String, required: true },
    currentYear: { type: String,  },
    division: { type: String },
    status: {
      type: String,
      enum: ['active', 'inactive', 'alumni', 'suspended'],
      default: 'active',
    },
    prn: { type: String, unique: true },
    counsellorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
     sessionToken:{
      type:String
    },
    // Added fields from Admission
    totalFees: { type: Number, default: 0 },
    feesCategory: { type: String },
    casteAsPerLC: { type: String },
    subCasteAsPerLC: { type: String },
    domicile: { type: String },
    nationality: { type: String },
    religionAsPerLC: { type: String },
    isForeignNational: { type: Boolean },
    motherName: { type: String },
    familyIncome: { type: Number },
    fatherGuardianWhatsappNumber: { type: String },
    motherMobileNumber: { type: String },
    seatType: { type: String },
    admissionCategoryDTE: { type: String },
    quota: { type: String },
    admissionYear: { type: String },
    round: { type: String },
    admissionType: { type: String },
    dteApplicationNumber: { type: String },
  },
  { timestamps: true }
);
delete mongoose.models.Student; // Fixed: case sensitivity
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);
export default Student;
