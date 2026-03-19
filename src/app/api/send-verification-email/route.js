// app/api/send-verification-email/route.js
import EmailVerification from '../../models/EmailVerification';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { connectToDatabase } from '@/app/lib/mongodb';

export async function POST(request) {
  const { email } = await request.json();

  if (!email) {
    return Response.json({ error: 'Email is required' }, { status: 400 });
  }

  await connectToDatabase();

  // Generate unique token
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiration

  try {
    // Store or update token in database
    await EmailVerification.findOneAndUpdate(
      { email },
      { 
        token,
        expiresAt,
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );

    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Email Verification for Your Enquiry',
      html: `
        <p>Please use the following token to verify your email:</p>
        <p><strong>${token}</strong></p>
        <p>Or click this link: <a href="${verificationLink}">Verify Email</a></p>
        <p>This token will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return Response.json({ success: true });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Failed to process verification' }, { status: 500 });
  }
}