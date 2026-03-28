import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema({
  staffId: { type: mongoose.Schema.Types.ObjectId, refPath: "role", required: true },
  role: { type: String, enum: ["HOD", "Teacher", "Staff", "Admin"], required: true },
  date: { type: String, required: true }, // store as YYYY-MM-DD
  status: { type: String, enum: ["Present", "Absent", "Leave"], default: "Absent" },
  remarks: { type: String, default: "" },
}, { timestamps: true });

delete mongoose.models.AttendanceRecord;
const AttendanceRecord = mongoose.models.AttendanceRecord || mongoose.model("AttendanceRecord", attendanceRecordSchema);

export default AttendanceRecord;
