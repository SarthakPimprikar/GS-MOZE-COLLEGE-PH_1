import mongoose from 'mongoose';

const AMCSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: [true, 'Please associate AMC with an inventory item'],
  },
  itemName: {
    type: String,
    required: [true, 'Please provide item name'],
  },
  vendorName: {
    type: String,
    required: [true, 'Please provide vendor name'],
  },
  vendorContact: {
    type: String,
    required: [true, 'Please provide vendor contact or email'],
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide AMC start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide AMC end date'],
  },
  renewalDate: {
    type: Date,
    required: [true, 'Please provide next renewal date'],
  },
  amcCost: {
    type: Number,
    required: [true, 'Please provide AMC cost'],
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Expired', 'Renewed', 'Pending Renewal'],
    default: 'Active',
  },
  remindersSent: {
    type: Boolean,
    default: false,
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { timestamps: true });

// Middleware to update status based on end date
AMCSchema.pre('save', function(next) {
  const today = new Date();
  if (this.endDate < today) {
    this.status = 'Expired';
  } else if (this.renewalDate <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) {
    // If renewal date is within 30 days
    this.status = 'Pending Renewal';
  } else {
    this.status = 'Active';
  }
  next();
});

export default mongoose.models.AMC || mongoose.model('AMC', AMCSchema);
