// app/api/verify-email/route.js
import EmailVerification from '../../models/EmailVerification';
import { connectToDatabase } from '@/app/lib/mongodb';

export async function POST(request) {
  await connectToDatabase();
  
  try {
    const { token, email } = await request.json();

    // Handle verification from email link (token only)
    if (token && !email) {
      const verification = await EmailVerification.findOne({ token });
      
      if (!verification) {
        return Response.json({ error: 'Invalid verification token' }, { status: 400 });
      }

      if (verification.expiresAt < new Date()) {
        await EmailVerification.deleteOne({ token });
        return Response.json({ error: 'Verification token has expired' }, { status: 400 });
      }

      // Mark as verified in database
      await EmailVerification.updateOne(
        { token },
        { $set: { verified: true } }
      );

      return Response.json({ 
        success: true,
        verified: true,
        email: verification.email
      });
    }

    // Handle verification from form (both token and email)
    if (!token || !email) {
      return Response.json({ error: 'Token and email are required' }, { status: 400 });
    }

    const verification = await EmailVerification.findOne({ email, token });

    if (!verification) {
      return Response.json({ error: 'Invalid verification token' }, { status: 400 });
    }

    if (verification.expiresAt < new Date()) {
      await EmailVerification.deleteOne({ email });
      return Response.json({ error: 'Verification token has expired' }, { status: 400 });
    }

    // Mark as verified in database
    await EmailVerification.updateOne(
      { email },
      { $set: { verified: true } }
    );

    return Response.json({ 
      success: true,
      verified: true,
      email
    });

  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Failed to verify email' }, { status: 500 });
  }
}