// app/api/send-otp/route.js
import { Twilio } from 'twilio';

export async function POST(request) {
  const { phone } = await request.json();

  if (!phone) {
    return Response.json({ error: 'Phone number is required' }, { status: 400 });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
  const client = new Twilio(accountSid, authToken);

  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Send OTP via SMS
    const message = await client.messages.create({
      body: `Your verification OTP is: ${otp}`,
      from: twilioPhone,
      to: `+91${phone}` // Assuming Indian numbers, adjust as needed
    });

    return Response.json({ 
      success: true, 
      otp: otp, // In production, you should store this in DB and verify against it
      messageSid: message.sid 
    });
  } catch (error) {
    console.error('Twilio error:', error);
    return Response.json({ 
      error: 'Failed to send OTP',
      details: error.message 
    }, { status: 500 });
  }
}