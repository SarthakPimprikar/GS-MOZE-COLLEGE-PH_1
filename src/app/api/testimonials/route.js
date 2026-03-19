import { connectToDatabase } from "../../../lib/mongoose";
import testimonialSchema from "../../models/testimonialSchema";

export async function GET(req) {
    try {
        await connectToDatabase();
        let testimonials = await testimonialSchema.find().sort({ order: 1 });

        if (!testimonials || testimonials.length === 0) {
            const defaultTestimonials = [
                {
                    name: "Dr. Rajesh Verma",
                    position: "Director, ABC Engineering College",
                    avatar: "/avatars/1.jpg",
                    rating: 5,
                    content:
                        "The lab management module alone saved us 15 hours per week. Our faculty can now focus on what matters most – teaching.",
                },
                {
                    name: "Prof. Anjali Deshpande",
                    position: "Principal, XYZ Polytechnic",
                    avatar: "/avatars/2.jpg",
                    rating: 4.5,
                    content:
                        "AICTE compliance & NAAC documentation became effortless. We cleared our accreditation with flying colors.",
                },
                {
                    name: "Dr. Sanjay Patel",
                    position: "HOD Computer Science, PQR Institute",
                    avatar: "/avatars/3.jpg",
                    rating: 5,
                    content:
                        "The placement module transformed our recruitment process. We achieved our highest placement rate ever – 92%!",
                },
                {
                    name: "Ms. Priya Iyer",
                    position: "Admin Director, LMN Technical Campus",
                    avatar: "/avatars/4.jpg",
                    rating: 4,
                    content:
                        "Fee automation reduced our processing time by 80%. Reconciliation reports save countless hours monthly.",
                },
            ];

            testimonials = await testimonialSchema.insertMany(defaultTestimonials);
        }

        return new Response(JSON.stringify({ testimonials }), { status: 200 });
    } catch (error) {
        console.error("Error fetching testimonials:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const { name, position, avatar, rating, content } = await req.json();

        if (!name || !position || !content || rating === undefined) {
            return new Response(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        const lastTestimonial = await testimonialSchema.findOne().sort({ order: -1 });
        const order = lastTestimonial ? lastTestimonial.order + 1 : 0;

        const newTestimonial = await testimonialSchema.create({
            name,
            position,
            avatar: avatar || "/avatars/default.jpg",
            rating,
            content,
            order,
        });

        return new Response(
            JSON.stringify({
                message: "Testimonial created successfully",
                testimonial: newTestimonial,
            }),
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating testimonial:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectToDatabase();
        const { id, name, position, avatar, rating, content } = await req.json();

        if (!id || !name || !position || !content || rating === undefined) {
            return new Response(
                JSON.stringify({ message: "Missing required fields" }),
                { status: 400 }
            );
        }

        const updatedTestimonial = await testimonialSchema.findByIdAndUpdate(
            id,
            { name, position, avatar, rating, content },
            { new: true }
        );

        if (!updatedTestimonial) {
            return new Response(
                JSON.stringify({ message: "Testimonial not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                message: "Testimonial updated successfully",
                testimonial: updatedTestimonial,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating testimonial:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new Response(
                JSON.stringify({ message: "Missing testimonial ID" }),
                { status: 400 }
            );
        }

        const deletedTestimonial = await testimonialSchema.findByIdAndDelete(id);

        if (!deletedTestimonial) {
            return new Response(
                JSON.stringify({ message: "Testimonial not found" }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({ message: "Testimonial deleted successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting testimonial:", error);
        return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
    }
}
