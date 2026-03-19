// app/api/check-verification/route.js
import EmailVerification from '../../models/EmailVerification';
import { connectToDatabase } from '@/app/lib/mongodb';

export async function POST(request) {
  const { email } = await request.json();

  if (!email) {
    return Response.json({ 
      verified: false,
      error: 'Email is required'
    }, { status: 400 });
  }

  await connectToDatabase();

  try {
    const verification = await EmailVerification.findOne({ email });
    
    return Response.json({
      verified: verification?.verified || false,
      exists: !!verification,
      email
    });
  } catch (error) {
    return Response.json({ 
      verified: false,
      error: 'Failed to check verification'
    }, { status: 500 });
  }
}