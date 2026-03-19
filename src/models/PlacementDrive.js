import mongoose from 'mongoose';

const placementDriveSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  jobDescription: {
    type: String
  },
  ctcPackage: {
    type: String,
    required: true // E.g., '12-15 LPA'
  },
  baseSalary: {
    type: Number, // For exact calculations/filters internally e.g. 1500000
  },
  jobLocation: [{
    type: String
  }],
  driveDate: {
    type: Date,
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Registration Open', 'Registration Closed', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  eligibilityCriteria: {
    minimumCGPA: { type: Number, default: 0 },
    allowedBranches: [{ type: String }],
    maxBacklogsAllowed: { type: Number, default: 0 },
    minimum10thPercent: { type: Number, default: 0 },
    minimum12thPercent: { type: Number, default: 0 },
    passingYear: [{ type: Number }]
  },
  selectionProcess: [{
    stageName: String, // e.g., 'Aptitude Test', 'Technical Interview', 'HR Round'
    description: String
  }],
  totalPlaced: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const PlacementDrive = mongoose.models.PlacementDrive || mongoose.model('PlacementDrive', placementDriveSchema);
export default PlacementDrive;
