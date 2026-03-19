import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  industry: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  logoUrl: {
    type: String,
    trim: true
  },
  hrContacts: [{
    name: String,
    email: String,
    phone: String,
    designation: String
  }],
  status: {
    type: String,
    enum: ['Active', 'Blacklisted', 'Inactive'],
    default: 'Active'
  },
  tier: {
    type: String,
    enum: ['Tier 1', 'Tier 2', 'Tier 3', 'Startup', 'MNC'],
    default: 'MNC'
  },
  pastVisitsCount: {
    type: Number,
    default: 0
  },
  totalHiresHistorically: {
    type: Number,
    default: 0
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
export default Company;
