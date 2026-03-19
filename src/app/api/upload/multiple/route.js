// app/api/upload/multiple/route.js
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from 'stream';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: CORS_HEADERS
  });
}

export async function POST(request) {
  try {
    // 1. Parse form data
    const formData = await request.formData();
    const files = formData.getAll("files"); // Get all files

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    console.log("Files to upload:", files.length);

    // 2. Initialize Google Auth (same as single upload)
    const auth = new google.auth.GoogleAuth({
      credentials: {
        "type": "service_account",
        "project_id": "dokumentguru",
        "private_key_id": "42cd8d8ed348d6fb55341a9a14eff8064190e6c2",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCZMRCazoMj7PhW\nLKEuTs6Bb8jD/mL+tfiX8KOeomfL8rzkPESV1SzOKdOPOv+TyCLveD6hSWZQhkBE\n2qYHkqggKj22BZrcyrpVChOVllWzbu0ldrKqsaQ4OM1VdXhJOHyvE8mg8BZaoVcY\nNGddZLavsW38u4K9fwAJ+v/CMTtNSG6TZtN5Sh5KeZ+s43XcL+SY5u338Xo8Xj3k\n+58pXa8PHsbavJv/nihZ9HMh0hXwmn9jC5dUU7nuWGgAYSmYHu+CZ/IPVoMkhKkG\nCaDE9xXR8r8FGqNkjvjeuZ1DrlAmTrNQoRMbdg7BA7mjbtvmO+k+SpCd7iOucJKl\nuZKPe/BTAgMBAAECggEAHTT0lH9RE3Vnt45UwK53wsfcQDntB+EL33QazfDq10CV\ncPJopSR6oWfqFQHLnpJmzr9fOYL0BeBCup3xT7pPYaqMD3ssFnJ0aig8qaV6+3Xn\nst/Zmp+5zppN08BMybECXKLqK0v7BxaBs3SyTGUaS48JiEj72UMwb7ayMoUOaGJe\nZr4iEjbD6AJL8VD3kmKDC/N3bbjntBMbHZRyRtUShymbLrSPsFwjP9iLhO97hd4g\nxaHUP4VYVHFy+hmgtArb6c+CKOemCx44vVoVyp9u1o/1B23dsWwXrnhZ23ACnMqV\nhM3KPKhE7BumXmYlX4jS9n4cMEtYTDioa/fKLiN6yQKBgQDHe2nRwrB5IJJ+lTB6\nGlKxw4Ggh9s0cAxbB7DnobhhSHZMyz0ZNvjM3ntBoz9c8Lnq+I6Vc04mgoP4cnmC\nRVX1BOM7bHavOhfaa6bXYtGTxCTiIjmj8ihtfUgWxQsqQ4IDapD1cca12c/18q8Q\n0yQyrDii2sUGD3nLpkDaeEkcZwKBgQDEmCwH6gInKnjsnBiBNc4XBYhPHS9Xaxt3\nNJSe6vcgVBCceW1kJ9EwihXw5+Hmb2bTZs8A6KwWI+Z6LSrw3L21/At8QcOjGN3I\nKHRiEUEoW1CwNsz6dlvzLsvE5/MHyve/N0WW12I9As7+Y1rPxd5bRMl9MSFb6fjf\n25enOvUZNQKBgQCuBUenKcRxpqylqNiFbHk/gmKO/HWKJUViFC+LolUK6P/qtlIy\nsPYTIvM7q4IXPhmylestDU3b4nfmQVcnAf2epgjlShWvf2pXrRn7Q8W4tp/Gdjz6\nfMIv4d8FnhfDYukEue6DcCH9emolEPUQJGGrovo1d8vxIYcK1Zo1/EEreQKBgQC+\n10Wu7Q/n+0fl0GXNUHDeUkWPHzKsttGztzwqxMbfABwb+ZgiaLCeYP2JnV/idPQp\ndZyvMi6TU4hRw/TyWiZjOefgWGrUsbfhrLvF0yAgT/yVAq2a2TjLafrvC4cVYod7\nfOk106GOvmI3+jTWiyseCDlcKUxL0GYC0UV3VjlFnQKBgQCA8VGyMTIa/QFYSe/f\nVNZZWebmOAhElNl6JJme0y8p9rHj0T/AApXP+UEUYQRN/p0D5eqCW8f30y0fd7xd\n7hjZ5ulJunWNq7CQcBhXzQVyNukaHF8ST6Z9IlrSR6sgbZ8MjUs/TqJCG5o3aLZI\n+2iSa4axpO/0OxYb88nUXNxQXw==\n-----END PRIVATE KEY-----\n".replace(/\\n/g, "\n"),
        "client_email": "dokumentguru@dokumentguru.iam.gserviceaccount.com",
        "client_id": "101763414526992231249",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/dokumentguru%40dokumentguru.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    // 3. Create drive client
    const drive = google.drive({ version: 'v3', auth });

    // 4. Process all files in parallel
    const uploadPromises = files.map(async (file) => {
      // Convert file to stream
      const buffer = await file.arrayBuffer();
      const stream = new Readable();
      stream.push(Buffer.from(buffer));
      stream.push(null);

      // Upload to Google Drive
      const response = await drive.files.create({
        requestBody: {
          name: file.name,
          mimeType: file.type,
          parents: ["15XV0UIVA0xgA7G7wDuL7t0RS5SWRpNJV"],
        },
        media: {
          mimeType: file.type,
          body: stream,
        },
      });

      // Set public permissions
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      return {
        documentUrl: `https://drive.google.com/uc?export=view&id=${response.data.id}`,
        documentId: response.data.id,
        fileName: file.name,
        mimeType: file.type,
      };
    });

    // 5. Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      uploadedFiles: results,
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error("Multiple upload error:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    return NextResponse.json(
      {
        error: "Failed to upload documents",
        details: error.message,
        ...(error.response?.data && { googleError: error.response.data })
      },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}