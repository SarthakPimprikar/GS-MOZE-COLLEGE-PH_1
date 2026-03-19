import mongoose from "mongoose";

const ElectionDutySchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "teacher", required: true },
  dutyName: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["Assigned", "In Progress", "Completed"], default: "Assigned" },
  certificateUrl: { type: String },
  remarks: { type: String }
}, { timestamps: true });

const PaperPublicationSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "teacher", required: true },
  title: { type: String, required: true },
  journal: { type: String, required: true },
  publicationDate: { type: Date, required: true },
  issn: { type: String },
  impactFactor: { type: Number },
  paperUrl: { type: String },
  coAuthors: [{ type: String }],
  status: { type: String, enum: ["Submitted", "Under Review", "Published"], default: "Published" }
}, { timestamps: true });

const COffRequestSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "teacher", required: true },
  earnedOnDate: { type: Date, required: true },
  reasonForEarning: { type: String, required: true },
  requestedDate: { type: Date },
  status: { type: String, enum: ["Pending", "Approved", "Used", "Rejected"], default: "Pending" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "teacher" },
  approverRemarks: { type: String }
}, { timestamps: true });

export const ElectionDuty = mongoose.models.ElectionDuty || mongoose.model("ElectionDuty", ElectionDutySchema);
export const PaperPublication = mongoose.models.PaperPublication || mongoose.model("PaperPublication", PaperPublicationSchema);
export const COffRequest = mongoose.models.COffRequest || mongoose.model("COffRequest", COffRequestSchema);
