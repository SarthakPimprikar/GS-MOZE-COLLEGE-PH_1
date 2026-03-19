//database schema for enquiry form 
import mongoose from 'mongoose';

const { Schema, model, models, Types } = mongoose;

const enquirySchema = new Schema({
  first: {
    type: String,
    required: true
  },
  middle: String,
  last: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
  },
  email: String,

  courseInterested: String,
  programType: String,
//sample
  source: {
    type: String,
  },
  status: {
    type: String,
    enum: ['New', 'In Progress','Contacted','Converted', 'Lost'],
    default: 'New',
  },
  counsellorId: {
    type: Types.ObjectId,
    ref: 'User', // optional: reference to a User model
  
  },
  followUps: [
    {
      date: Date,
      note: String,
      updatedBy: {
        type: Types.ObjectId,
        ref: 'User', // optional: reference to a User model
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notes:{
    type: String,
  },
});
delete mongoose.models.enquiry
const enquiry = mongoose.models.enquiry|| mongoose.model('enquiry', enquirySchema);

export default enquiry;