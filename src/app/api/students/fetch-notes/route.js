import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "notes/",
      max_results: 100,
      resource_type: "raw", // PDFs, DOCX, etc.
      context: true,
    });

    const notes = result.resources.map((file) => ({
      _id: file.public_id,
      title: file.context?.custom?.title || file.filename,
      description: file.context?.custom?.description || "",
      subject: file.context?.custom?.subject || "General",
      fileUrl: file.secure_url,
      createdAt: file.created_at,
      fileSize: (file.bytes / (1024 * 1024)).toFixed(2) + " MB",
      downloads: 0,
      type: file.format
        ? file.format.toUpperCase()
        : file.resource_type?.toUpperCase() || "UNKNOWN",
    }));

    return NextResponse.json({ success: true, data: notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
