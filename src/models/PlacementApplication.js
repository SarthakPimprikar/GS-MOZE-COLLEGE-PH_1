import mongoose from 'mongoose';

const placementApplicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Assuming default 'Student' model holds user academic mapping
    required: true
  },
  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlacementDrive',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected', 'Waitlisted', 'Offer Accepted', 'Offer Declined'],
    default: 'Applied'
  },
  interviewRounds: [{
    roundName: { type: String },
    date: { type: Date },
    status: { type: String, enum: ['Pending', 'Passed', 'Failed', 'Absent'], default: 'Pending' },
    interviewerFeedback: { type: String },
    interviewerName: { type: String }
  }],
  offerDetails: {
    offeredCTC: { type: Number },
    role: { type: String },
    location: { type: String },
    offerLetterUrl: { type: String },
    dateOffered: { type: Date }
  },
  internalNotes: {
    type: String // Visible only to Placement Admins
  }
}, {
  timestamps: true
});

// A student should only apply once to a specific placement drive
placementApplicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true });

const PlacementApplication = mongoose.models.PlacementApplication || mongoose.model('PlacementApplication', placementApplicationSchema);
export default PlacementApplication;
