import mongoose from "mongoose";

const coursePlanSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  branch: { type: String, required: true },
  year: { type: String, required: true },
  division: { type: String, default: "-" },
  batch: { type: String, default: "-" },
  loadType: {
    type: String,
    enum: ["Theory", "Lab", "Audit"],
    default: "Theory",
  },

  title: { type: String, required: true },
  description: { type: String, required: true },

  modules: [
    {
      _id: { type: String },
      title: { type: String, required: true },
      duration: { type: Number, default: 0 },
      lessons: [
        {
          _id: { type: String },
          title: { type: String, required: true },
          description: { type: String, default: "" },
          duration: { type: Number, default: 0 },
          completed: { type: Boolean, default: false },
        },
      ],
    },
  ],

  execute: { type: Boolean, default: false },
  report: { type: String },
  summaryReport: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// ❗ FIX: Delete existing model before defining again (important for hot reload)
export default mongoose.models.CoursePlan ||
  mongoose.model("CoursePlan", coursePlanSchema);
