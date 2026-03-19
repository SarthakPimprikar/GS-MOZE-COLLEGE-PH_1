import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
    {
        icon: {
            type: String,
            enum: [
                "BookOpenText",
                "GraduationCap",
                "IndianRupee",
                "Library",
                "CalendarDays",
                "UserCog",
                "ClipboardSignature",
                "BarChart4",
                "FlaskConical",
                "Building2",
                "Briefcase",
                "FileSearch",
            ],
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

if (mongoose.models && mongoose.models.module) {
    delete mongoose.models.module;
}

const moduleModel = mongoose.models.module || mongoose.model("module", moduleSchema);

export default moduleModel;
