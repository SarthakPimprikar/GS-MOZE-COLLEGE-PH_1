import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
    {
        icon: {
            type: String,
            enum: [
                "Globe",
                "Fingerprint",
                "MessageSquare",
                "CalendarRange",
                "ClipboardList",
                "Users2",
                "CreditCard",
                "BarChart3",
                "Building",
                "BriefcaseBusiness",
                "FileCheck",
                "FlaskRound",
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

if (mongoose.models && mongoose.models.feature) {
    delete mongoose.models.feature;
}

const featureModel = mongoose.models.feature || mongoose.model("feature", featureSchema);

export default featureModel;
