import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        position: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: "/avatars/default.jpg",
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },
        content: {
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

if (mongoose.models && mongoose.models.testimonial) {
    delete mongoose.models.testimonial;
}

const testimonialModel = mongoose.models.testimonial || mongoose.model("testimonial", testimonialSchema);

export default testimonialModel;
