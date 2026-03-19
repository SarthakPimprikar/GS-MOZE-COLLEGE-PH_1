//database schema for student

import mongoose from 'mongoose';

const sampleSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
    },

    fullName: { type: String },

    email: { type: String },

    mobileNumber: { type: String },

    dateOfBirth: { type: Date },

    address: {
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    departmentName:{type:String},
  },
  { timestamps: true }
);

delete mongoose.models.sample

const sample = mongoose.models.sample || mongoose.model('sample', sampleSchema);

export default sample;