import mongoose from "mongoose";

const benefitSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      enum: ["Users", "LineChart", "Folder", "CalendarCheck", "CheckSquare", "FileStack", "ClipboardList", "ShieldCheck"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.benefit) {
  delete mongoose.models.benefit;
}

const benefit = mongoose.models.benefit || mongoose.model("benefit", benefitSchema);

export default benefit;
