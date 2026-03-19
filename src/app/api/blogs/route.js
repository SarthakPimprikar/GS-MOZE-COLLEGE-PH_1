import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Blog from "@/models/Blog";

// Helper for error handling
const handleError = (error) => {
    console.error("Blog API Error:", error);
    return NextResponse.json(
        { success: false, message: error.message || "Internal Server Error" },
        { status: 500 }
    );
};

export async function GET(req) {
    try {
        await connectToDatabase();

        // Check for public query param
        const { searchParams } = new URL(req.url);
        const isPublic = searchParams.get('public') === 'true';

        let query = {};
        if (isPublic) {
            query.isPublished = true;
        }

        const blogs = await Blog.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, count: blogs.length, data: blogs });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(req) {
    try {
        await connectToDatabase();
        const body = await req.json();

        // Basic validation
        if (!body.title || !body.content || !body.description) {
            return NextResponse.json(
                { success: false, message: "Title, description, and content are required" },
                { status: 400 }
            );
        }

        const newBlog = await Blog.create(body);

        return NextResponse.json(
            { success: true, message: "Blog created successfully", data: newBlog },
            { status: 201 }
        );
    } catch (error) {
        return handleError(error);
    }
}
