import { google } from "googleapis";
import { Readable } from "stream";

export async function uploadToGoogleDrive(file, parentFolderId = "15XV0UIVA0xgA7G7wDuL7t0RS5SWRpNJV") {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: "dokumentguru",
      private_key_id: "42cd8d8ed348d6fb55341a9a14eff8064190e6c2",
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: "dokumentguru@dokumentguru.iam.gserviceaccount.com",
      client_id: "101763414526992231249",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/dokumentguru%40dokumentguru.iam.gserviceaccount.com",
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({ version: "v3", auth });

  const buffer = await file.arrayBuffer();
  const stream = new Readable();
  stream.push(Buffer.from(buffer));
  stream.push(null);

  const response = await drive.files.create({
    requestBody: {
      name: file.name,
      mimeType: file.type,
      parents: [parentFolderId],
    },
    media: {
      mimeType: file.type,
      body: stream,
    },
  });

  await drive.permissions.create({
    fileId: response.data.id,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  });

  const fileUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`;
  return { fileUrl, fileId: response.data.id };
}