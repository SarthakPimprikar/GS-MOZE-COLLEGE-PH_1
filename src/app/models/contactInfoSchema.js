import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        phone1: { type: String, required: true },
        phone2: { type: String, required: false }, // Optional second number
        addressLine1: { type: String, required: true },
        addressLine2: { type: String, required: false },
        addressLine3: { type: String, required: true }, // e.g., City - Zip
        businessHours: { type: String, required: true },
        googleMapUrl: { type: String, required: false }, // Optional map URL
    },
    { timestamps: true }
);

if (mongoose.models && mongoose.models.contactInfo) {
    delete mongoose.models.contactInfo;
}

const contactInfo = mongoose.models.contactInfo || mongoose.model("contactInfo", contactInfoSchema);

export default contactInfo;
