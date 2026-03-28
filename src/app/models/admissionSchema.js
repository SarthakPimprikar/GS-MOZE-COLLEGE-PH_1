// import mongoose from 'mongoose';



// const admissionSchema = new mongoose.Schema({

//   enquiryId: {

//     type: mongoose.Schema.Types.ObjectId,

//     ref: 'enquiry',

//     // required: true

//   },

//   counsellorId: {

//     type: mongoose.Schema.Types.ObjectId,

//     ref: 'User',

//     // required: true

//   },



//   // System generated fields

//   dteApplicationNumber: { type: String },

//   prn: { type: String, unique: true, sparse: true },

//   isPrnGenerated: { type: Boolean, default: false },



//   // Personal details

//   admissionYear: { type: String, required: true }, // e.g. "2024-25"

//   email: { type: String, required: true, lowercase: true },



//   // Name details

//   fullName: { type: String, required: true }, // As per last qualifying exam

//   nameAsPerAadhar: { type: String, required: true },

//   firstName: { type: String, required: true },

//   middleName: { type: String },

//   lastName: { type: String, required: true },



//   gender: {

//     type: String,

//     required: true,

//     enum: ['Male', 'Female', 'Other']

//   },



//   // Academic details

//   programType: {

//     type: String,

//     required: true,

//     enum: ["Diploma", "UG", "PG"]

//   },

//   year: {

//     type: String,

//     required: true,

//     enum: ['1st Year', '2nd Year', '3rd Year', '4th Year']

//   },

//   branch: { type: String, required: true }, // Course/Branch name

//   shift: { type: String },



//   // Admission process details

//   round: {

//     type: String,

//     enum: ["CAP1", "CAP2", "CAP3", "Institute Level"],

//     required: true

//   },

//   quota: { type: String },

//   seatType: {

//     type: String,

//     required: true,

//     enum: ["GOV", "MIN", "Management", "TFWS"]

//   },

//   admissionCategoryDTE: {

//     type: String,

//     required: true,

//     enum: ["CAP", "Institute Level", "Against CAP"]

//   },

//   feesCategory: { type: String },

//   admissionType: { type: String },



//   // Personal background details

//   casteAsPerLC: { type: String, required: true },

//   subCasteAsPerLC: { type: String },

//   domicile: { type: String, required: true },

//   nationality: { type: String, required: true },

//   religionAsPerLC: { type: String },

//   isForeignNational: { type: Boolean, default: false },



//   dateOfBirth: { type: Date, required: true },



//   // Family details

//   motherName: { type: String, required: true }, // As per LC/TC

//   familyIncome: { type: Number },



//   // Contact details

//   studentWhatsappNumber: { type: String, required: true },

//   fatherGuardianWhatsappNumber: { type: String, required: true },

//   motherMobileNumber: { type: String },



//   // Documents

//   documents: [

//     {

//       type: { type: String }, // e.g., "aadhar", "lcCertificate"

//       fileName: { type: String },

//       fileUrl: { type: String },

//       mimeType: { type: String }

//     }

//   ],



//   // Status fields

//   status: {

//     type: String,

//     enum: ['inProcess', 'approved', 'rejected'],

//     default: 'inProcess',

//   },



//   // System timestamps

//   createdAt: { type: Date, default: Date.now },

//   updatedAt: { type: Date, default: Date.now }



// }, { timestamps: true });



// delete mongoose.models.admission;

// const admission = mongoose.models.admission || mongoose.model('admission', admissionSchema);



// export default admission;





//father name, blood group, aadhar number, physically handicapped, emergency contact number, 





import mongoose from "mongoose";



const admissionSchema = new mongoose.Schema(

  {

    enquiryId: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "enquiry",

      // Optional for Excel import

    },

    counsellorId: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      // Optional for Excel import

    },

    assignedStaff: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

    },



    // System generated fields

    dteApplicationNumber: { type: String },

    prn: { type: String, unique: true, sparse: true },

    isPrnGenerated: { type: Boolean, default: false },



    // Personal details

    admissionYear: { type: String, default: null },

    email: { type: String, required: true, lowercase: true },



    // Name details
    firstName: { type: String },
    middleName: { type: String, default: "" },
    lastName: { type: String },
    fullName: { type: String, required: true },
    
    // Additional Basic Info
    studentNumber: { type: String }, // e.g., 11183021
    studentWhatsappNumber: { type: String }, // e.g., (000) 000-0000
    
    gender: { type: String },
    dateOfBirth: { type: String },

    // Academic details
    programType: { type: String }, // Diploma, UG, PG
    year: { type: String }, // 1st Year, 2nd Year, etc. (Year Level)
    branch: { type: String }, // Degree Program
    shift: { type: String, default: "" },
    division: { type: String, default: null },

    // High School Details
    highSchool: {
      schoolName: { type: String },
      board: { type: String },
      graduationYear: { type: String },
      percentage: { type: String },
      city: { type: String }
    },

    // Family details
    motherName: { type: String },
    motherMobileNumber: { type: String },
    fatherGuardianWhatsappNumber: { type: String },
    emergencyContact: {
      firstName: { type: String },
      lastName: { type: String },
      relationship: { type: String },
      phone: { type: String }
    },
    familyIncome: { type: Number, default: 0 },
    totalFees: { type: Number, default: 0 },

    // Address Details
    presentAddress: {
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String, default: "India" },
    },
    permanentAddress: {
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      country: { type: String, default: "India" },
    },

    // Legacy/Old address field for compatibility (optional)
    address: [
      {
        addressLine: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: Number },
        country: { type: String },
      },
    ],

    // Documents (optional)
    documents: [
      {
        type: { type: String },
        fileName: { type: String },
        fileUrl: { type: String },
        mimeType: { type: String },
        uploadedAt: { type: Date, default: Date.now }
      },
    ],

    // Status
    status: {
      type: String,
      enum: ["pending", "inProcess", "verified", "selected", "enrolled", "rejected"],
      required: true,
      default: "pending",
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);



// Avoid overwrite issues in dev

delete mongoose.models.admission;
delete mongoose.models.Admission; // Also delete capitalized version

const admission =
  mongoose.models.Admission || mongoose.model("Admission", admissionSchema); // Use capitalized name



export default admission;