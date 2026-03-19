import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import ImportedFile from "@/app/models/importedFileSchema";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const formData = await request.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Validate file type (Excel files)
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Only Excel files are allowed" 
      }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "imported-excel");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory already exists, continue
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${originalName}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save file to filesystem
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Create file URL for access
    const fileUrl = `/uploads/imported-excel/${fileName}`;

    // Create imported file record
    const importedFile = new ImportedFile({
      fileName: fileName,
      originalFileName: originalName,
      filePath: fileUrl,
      fileSize: file.size,
      mimeType: file.type,
      importedBy: userId,
      status: "processing"
    });

    await importedFile.save();

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      importedFile: {
        id: importedFile._id,
        fileName: originalName,
        fileSize: file.size,
        uploadedAt: importedFile.createdAt
      }
    });

  } catch (error) {
    console.error("Imported file upload error:", error);
    return NextResponse.json({
      error: "Failed to upload file",
      details: error.message
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Find all imported files for this user
    console.log("Searching for files with userId:", userId); // Debug log
    const importedFiles = await ImportedFile.find({ importedBy: userId })
      .sort({ createdAt: -1 })
      .populate('importedBy', 'name email')
      .lean();

    console.log("Found imported files:", importedFiles); // Debug log

    return NextResponse.json({
      success: true,
      importedFiles: importedFiles || []
    });

  } catch (error) {
    console.error("Get imported files error:", error);
    return NextResponse.json({
      error: "Failed to retrieve imported files",
      details: error.message
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { fileId, status, totalRecords, importedRecords, duplicateRecords, errorRecords, importErrors } = body;

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }

    // Update imported file record with import results
    const updateData = {
      updatedAt: new Date()
    };

    if (status) updateData.status = status;
    if (totalRecords !== undefined) updateData.totalRecords = totalRecords;
    if (importedRecords !== undefined) updateData.importedRecords = importedRecords;
    if (duplicateRecords !== undefined) updateData.duplicateRecords = duplicateRecords;
    if (errorRecords !== undefined) updateData.errorRecords = errorRecords;
    if (importErrors) updateData.importErrors = importErrors;

    const updatedFile = await ImportedFile.findByIdAndUpdate(
      fileId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedFile) {
      return NextResponse.json({ error: "Imported file not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Import status updated successfully",
      importedFile: updatedFile
    });

  } catch (error) {
    console.error("Update imported file error:", error);
    return NextResponse.json({
      error: "Failed to update imported file",
      details: error.message
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 });
    }

    // Find and delete the imported file record
    const deletedFile = await ImportedFile.findByIdAndDelete(fileId);

    if (!deletedFile) {
      return NextResponse.json({ error: "Imported file not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Imported file deleted successfully",
      deletedFile: deletedFile
    });

  } catch (error) {
    console.error("Delete imported file error:", error);
    return NextResponse.json({
      error: "Failed to delete imported file",
      details: error.message
    }, { status: 500 });
  }
}
