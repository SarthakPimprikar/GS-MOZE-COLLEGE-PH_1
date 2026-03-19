// database schema for teachers

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const teacherSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
  },
 password: {
  type: String,
  required: true,
  minlength: 8
},

  department: {
    type: String,
    required: function() {
      // Department is required only if role is not HOD
      return this.role !== 'hod';
    },
    default: null
  },
  teacherId: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfJoining: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ['teacher', 'hod'], // Added HOD to enum
    default: 'teacher'
  },
   sessionToken:{
      type:String
    }
});
delete mongoose.models.teacher
const teacher = mongoose.models.teacher || mongoose.model('teacher', teacherSchema);

export default teacher;