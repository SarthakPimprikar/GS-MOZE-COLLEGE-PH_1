import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Blog from "@/models/Blog";

const handleError = (error) => {
    console.error("Blog API Error:", error);
    return NextResponse.json(
        { success: false, message: error.message || "Internal Server Error" },
        { status: 500 }
    );
};

export async function GET(req, { params }) {
    try {
        await connectToDatabase();
        const { id } = await params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return NextResponse.json(
                { success: false, message: "Blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: blog });
    } catch (error) {
        return handleError(error);
    }
}

export async function PUT(req, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;
        const body = await req.json();

        const updatedBlog = await Blog.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updatedBlog) {
            return NextResponse.json(
                { success: false, message: "Blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Blog updated", data: updatedBlog });
    } catch (error) {
        return handleError(error);
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();
        const { id } = params;

        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return NextResponse.json(
                { success: false, message: "Blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: "Blog deleted" });
    } catch (error) {
        return handleError(error);
    }
}
