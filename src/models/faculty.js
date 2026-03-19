import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  facultyId: { type: String, unique: true },
  department: {String},
  subjects: [{ 
    subjectCode: String, 
    course: String, 
    semester: Number 
  }],
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  
  designation: {
    type: String,
    default: "Assistant Professor"
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  dob: {
    type: Date
  },
  dateOfJoining: {
    type: Date,
    required: true
  }

});

export default mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);
