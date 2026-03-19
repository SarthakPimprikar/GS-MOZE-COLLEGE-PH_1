// import crypto from 'crypto';
// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// // Mock database functions - replace these with your actual database calls
// async function getUserByEmail(email) {
//   // Implement your database query here
//   // Example with Prisma:
//   // return await prisma.user.findUnique({ where: { email } });
// }

// async function updateUser(userId, data) {
//   // Implement your database update here
//   // Example with Prisma:
//   // return await prisma.user.update({ 
//   //   where: { id: userId }, 
//   //   data: {
//   //     resetToken: data.resetToken,
//   //     resetTokenExpiry: new Date(data.resetTokenExpiry)
//   //   }
//   // });
// }

// async function sendPasswordResetEmail(email, resetUrl) {
//   // Validate environment variables
//   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.EMAIL_FROM) {
//     throw new Error('Email configuration is missing');
//   }

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: `"Techedu - " <${process.env.EMAIL_FROM}>`,
//     to: email,
//     subject: 'Password Reset Request',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #333;">Password Reset Request</h2>
//         <p>You requested a password reset for your account. Click the button below to set a new password:</p>
//         <a href="${resetUrl}" 
//            style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">
//           Reset Password
//         </a>
//         <p>If you didn't request this, please ignore this email. This link will expire in 1 hour.</p>
//         <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
//         <p style="font-size: 12px; color: #777;">
//           For security reasons, we don't store your password. This link can only be used once.
//         </p>
//       </div>
//     `,
//     // Optional text version for email clients that don't support HTML
//     text: `You requested a password reset. Please visit the following link to reset your password:\n\n${resetUrl}\n\nThis link expires in 1 hour.`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("mail senddddddddddddddddd.....");
    
//   } catch (error) {
//     console.error('Email sending error:', error);
//     throw new Error('Failed to send password reset email');
//   }
// }

// export async function POST(request) {
//   // Rate limiting check (implement your own or use a library)
//   // This prevents abuse of the endpoint
  
//   try {
//     const { email } = await request.json();

//     // Validate email format
//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       return NextResponse.json(
//         { message: 'Please provide a valid email address' },
//         { status: 400 }
//       );
//     }

//     // Check if user exists (without revealing if they don't)
//     const user = await getUserByEmail(email);
//     if (!user) {
//       // Return success to prevent email enumeration attacks
//       return NextResponse.json({ success: true });
//     }

//     // Generate secure token
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

//     // Store hashed token in database (never store plain tokens)
//     const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    
//     await updateUser(user.id, {
//       resetToken: hashedToken,
//       resetTokenExpiry: new Date(resetTokenExpiry)
//     });

//     // Create reset URL with plain token (will be hashed when verified)
//     const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&id=${user.id}`;


//     console.log("URLLLLLLLLLLLLLLLL: ",resetUrl);
    
//     // Send email
//     await sendPasswordResetEmail(email, resetUrl);

//     return NextResponse.json({ 
//       success: true,
//       message: 'If an account exists with this email, a reset link has been sent'
//     });

//   } catch (error) {
//     console.error('Password reset error:', error);
//     return NextResponse.json(
//       { 
//         message: error.message || 'An error occurred while processing your request',
//         success: false
//       },
//       { status: 500 }
//     );
//   }
// }



// import User from '@/app/models/userSchema';
// import Teacher from '@/app/models/teacherSchema'; 
// import { connectToDatabase } from '@/app/lib/mongodb';
// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';
// import crypto from 'crypto';

// async function sendPasswordResetEmail(email, resetUrl) {
//   // Validate environment variables
//   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.EMAIL_FROM) {
//     throw new Error('Email configuration is missing');
//   }

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: `"Techedu" <${process.env.EMAIL_FROM}>`,
//     to: email,
//     subject: 'Password Reset Request',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #333;">Password Reset Request</h2>
//         <p>You requested a password reset for your account. Click the button below to set a new password:</p>
//         <a href="${resetUrl}" 
//            style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">
//           Reset Password
//         </a>
//         <p>If you didn't request this, please ignore this email. This link will expire in 1 hour.</p>
//         <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
//         <p style="font-size: 12px; color: #777;">
//           For security reasons, we don't store your password. This link can only be used once.
//         </p>
//       </div>
//     `,
//     text: `You requested a password reset. Please visit the following link to reset your password:\n\n${resetUrl}\n\nThis link expires in 1 hour.`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("hhhhhhhhhhhhhhhhhhhheeeeeeeeeeeeeeeee");
    
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Failed to send password reset email');
//   }
// }

// async function getUserByEmail(email) {
//   await connectToDatabase();
  
//   try {

//     console.log("Emailllllllll: ",email);
    
//     // Check in User collection first
//     const user = await User.findOne({ email });
//     if (user) {
//       return { ...user.toObject(), id: user._id, userType: 'user' };
//     }

//     console.log(user);
    

//     // If not found in User, check in Teacher collection
//     const teacher = await Teacher.findOne({ email });
//     if (teacher) {
//       return { ...teacher.toObject(), id: teacher._id, userType: 'teacher' };
//     }

//     console.log(teacher);
    
//     // If not found in either collection
//     return null;
//   } catch (error) {
//     console.error('Error finding user by email:', error);
//     throw error;
//   }
// }

// async function updateUser(userId, data, userType) {
//   await connectToDatabase();
  
//   try {
//     if (userType === 'user') {
//       return await User.findByIdAndUpdate(userId, data, { new: true });
//     } else if (userType === 'teacher') {
//       return await Teacher.findByIdAndUpdate(userId, data, { new: true });
//     }
//     throw new Error('Invalid user type');
//   } catch (error) {
//     console.error('Error updating user:', error);
//     throw error;
//   }
// }

// export async function POST(request) {
//   try {
//     const { email } = await request.json();

//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       return NextResponse.json(
//         { message: 'Please provide a valid email address' },
//         { status: 400 }
//       );
//     }

//     const user = await getUserByEmail(email);
//     if (!user) {
//       // Return success even if user not found to prevent email enumeration
//       return NextResponse.json({ success: true });
//     }

//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
//     const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

//     await updateUser(user.id, {
//       resetToken: hashedToken,
//       resetTokenExpiry: new Date(resetTokenExpiry)
//     }, user.userType);

//     const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&id=${user.id}&type=${user.userType}`;
//     await sendPasswordResetEmail(email, resetUrl);

//     return NextResponse.json({ 
//       success: true,
//       message: 'If an account exists with this email, a reset link has been sent'
//     });

//   } catch (error) {
//     console.error('Password reset error:', error);
//     return NextResponse.json(
//       { 
//         message: error.message || 'An error occurred while processing your request',
//         success: false
//       },
//       { status: 500 }
//     );
//   }
// }


// import User from '@/app/models/userSchema';
// import Teacher from '@/app/models/teacherSchema'; 
// import { connectToDatabase } from '@/app/lib/mongodb';
// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';
// import crypto from 'crypto';

// async function sendPasswordResetEmail(email, resetUrl) {
//   // Validate environment variables
//   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || !process.env.EMAIL_FROM) {
//     throw new Error('Email configuration is missing');
//   }

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: `"Techedu" <${process.env.EMAIL_FROM}>`,
//     to: email,
//     subject: 'Password Reset Request',
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//         <h2 style="color: #333;">Password Reset Request</h2>
//         <p>You requested a password reset for your account. Click the button below to set a new password:</p>
//         <a href="${resetUrl}" 
//            style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">
//           Reset Password
//         </a>
//         <p>If you didn't request this, please ignore this email. This link will expire in 1 hour.</p>
//         <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
//         <p style="font-size: 12px; color: #777;">
//           For security reasons, we don't store your password. This link can only be used once.
//         </p>
//       </div>
//     `,
//     text: `You requested a password reset. Please visit the following link to reset your password:\n\n${resetUrl}\n\nThis link expires in 1 hour.`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw new Error('Failed to send password reset email');
//   }
// }

// async function getUserByEmail(email) {
//   await connectToDatabase();
//   console.log(email);
  
//   try {
//     // Check in User collection first (for Admin, Staff, HR)
//     const user = await User.findOne({ 
//       email,
//       role: { $in: ['Admin', 'Staff', 'HR'] } // Only these roles in User collection
//     });
    
//     if (user) {
//       return { ...user.toObject(), id: user._id, userType: 'user' };
//     }

//     // If not found in User, check in Teacher collection (for Teacher, HOD)
//     const teacher = await Teacher.findOne({ 
//       email,
//       role: { $in: ['Teacher', 'HOD'] } // Only these roles in Teacher collection
//     });
    
//     if (teacher) {
//       return { ...teacher.toObject(), id: teacher._id, userType: 'teacher' };
//     }

//     console.log(user);
//     console.log(teacher);
    

//     // If not found in either collection
//     return null;
//   } catch (error) {
//     console.error('Error finding user by email:', error);
//     throw error;
//   }
// }

// async function updateUser(userId, data, userType) {
//   await connectToDatabase();
  
//   try {
//     if (userType === 'user') {
//       return await User.findByIdAndUpdate(userId, data, { new: true });
//     } else if (userType === 'teacher') {
//       return await Teacher.findByIdAndUpdate(userId, data, { new: true });
//     }
//     throw new Error('Invalid user type');
//   } catch (error) {
//     console.error('Error updating user:', error);
//     throw error;
//   }
// }

// export async function POST(request) {
//   try {
//     const { email } = await request.json();

//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       return NextResponse.json(
//         { message: 'Please provide a valid email address' },
//         { status: 400 }
//       );
//     }

//     const user = await getUserByEmail(email);
//     if (!user) {
//       // Return success even if user not found to prevent email enumeration
//       return NextResponse.json({ success: true });
//     }

//     const resetToken = crypto.randomBytes(32).toString('hex');
//     const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
//     const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

//     await updateUser(user.id, {
//       resetToken: hashedToken,
//       resetTokenExpiry: new Date(resetTokenExpiry)
//     }, user.userType);

//     const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&id=${user.id}&type=${user.userType}`;
//     await sendPasswordResetEmail(email, resetUrl);

//     return NextResponse.json({ 
//       success: true,
//       message: 'If an account exists with this email, a reset link has been sent'
//     });

//   } catch (error) {
//     console.error('Password reset error:', error);
//     return NextResponse.json(
//       { 
//         message: error.message || 'An error occurred while processing your request',
//         success: false
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '@/app/models/userSchema';
import Teacher from '@/app/models/teacherSchema';
import { connectToDatabase } from '@/app/lib/mongodb';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check in User collection (Admin, Staff, HR)
    let user = await User.findOne({ 
      email,
      role: { $in: ['admin', 'staff', 'hr'] }
    });

    let userType = 'user';
    console.log("user = ",user)
    if (!user) {
      // Check in Teacher collection (Teacher, HOD)
      user = await Teacher.findOne({ 
        email,
        role: { $in: ['teacher', 'hod'] }
      });
      userType = 'teacher';
    }

    if (!user) {
      // Return success to prevent email enumeration
      return NextResponse.json({ success: true });
    }

    // Generate token and expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Update user in appropriate collection
    if (userType === 'user') {
      await User.findByIdAndUpdate(user._id, {
  resetPasswordToken: hashedToken,
  resetPasswordExpires: new Date(resetTokenExpiry)
});

    } else {
     await Teacher.findByIdAndUpdate(user._id, {
  resetPasswordToken: hashedToken,
  resetPasswordExpires: new Date(resetTokenExpiry)
});

    }

    // Send email
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&id=${user._id}&type=${userType}`;
    await sendPasswordResetEmail(email, resetUrl);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendPasswordResetEmail(email, resetUrl) {
  console.log("start ",email)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log("end")
}