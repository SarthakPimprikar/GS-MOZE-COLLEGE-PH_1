import mongoose from 'mongoose';


const studentAttendanceSchema = new mongoose.Schema({
  //studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  facultyId: { type: String, required: true },
  date: { type: Date, required: true },
  subject: { type: String, required: true },
  course: { type: String, required: true },
  semester: { type: Number, required: true },
  
  attendance: [
    {
      studentId: { type: String, required: true },
      status: { type: String, enum: ['Present', 'Absent'], required: true },
    },
  ]
});

export default mongoose.models.StudentAttendance || mongoose.model('StudentAttendance', studentAttendanceSchema);
