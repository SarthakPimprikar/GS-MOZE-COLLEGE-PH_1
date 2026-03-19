import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get('file') || data.get('files');

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const path = join(uploadDir, filename);

    await writeFile(path, buffer);

    const url = `/uploads/${filename}`;
    return NextResponse.json({ url, documentUrl: url, message: "File uploaded successfully" }, { status: 201 });

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ message: "Server error during upload" }, { status: 500 });
  }
}
