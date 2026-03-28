// // POST handler to login users
//import bcrypt from "bcryptjs";
//import userSchema from "../../models/userSchema";
//import teacherSchema from "../../models/teacherSchema";
//import studentSchema from "../../models/studentSchema";
//import { connectToDatabase } from "../../lib/mongodb";
//import { cookies } from "next/headers";
//import crypto from "crypto";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const { email, password, role } = body;
//     console.log(email, password, role);

//     // Validate input
//     if (!email || !password || !role) {
//       return new Response(
//         JSON.stringify({
//           message: "Email, password, and role are required",
//         }),
//         {
//           status: 400,
//         }
//       );
//     }

//     // Validate role
//     const validRoles = ["admin", "student", "staff", "parents", "hod"];
//     if (!validRoles.includes(role)) {
//       return new Response(
//         JSON.stringify({
//           message: "Invalid role",
//         }),
//         {
//           status: 400,
//         }
//       );
//     }

//     await connectToDatabase();

//     if (role === "hod") {
//       // Use findOne instead of find to get a single document
//       const hodUser = await teacher.findOne({
//         email,
//         role: "hod",
//       });

//       console.log("HOD User:", hodUser);

//       if (!hodUser) {
//         return new Response(
//           JSON.stringify({
//             message: "Invalid email or not authorized as HOD",
//           }),
//           {
//             status: 401,
//           }
//         );
//       }

//       // Check password
//       const passwordMatch = await bcrypt.compare(password, hodUser.password);
//       if (!passwordMatch) {
//         return new Response(
//           JSON.stringify({
//             message: "Incorrect password",
//           }),
//           {
//             status: 401,
//           }
//         );
//       }

//       // Create session
//       const sessionToken = require("crypto").randomBytes(32).toString("hex");
//       hodUser.sessionToken = sessionToken;
//       hodUser.lastLogin = new Date();
//       await hodUser.save();

//       cookies().set("sessionToken", sessionToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 60 * 60 * 24 * 7, // 1 week
//         path: "/",
//       });
//       cookies().set("role", role, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 60 * 60 * 24 * 7,
//         path: "/",
//       });

//       return new Response(
//         JSON.stringify({
//           message: "Login successful",
//           user: {
//             id: hodUser._id,
//             fullName: hodUser.fullName,
//             email: hodUser.email,
//             role: "hod",
//             department: hodUser.department,
//             teacherId: hodUser.teacherId,
//           },
//         }),
//         { status: 200 }
//       );
//     }

//     // Original login logic for other roles
//     const userFromDB = await userSchema.findOne({ email, role });

//     if (!userFromDB) {
//       return new Response(
//         JSON.stringify({
//           message: "Invalid email or role",
//         }),
//         {
//           status: 401,
//         }
//       );
//     }

//     // Check password
//     const passwordMatch = await bcrypt.compare(password, userFromDB.password);
//     if (!passwordMatch) {
//       return new Response(
//         JSON.stringify({
//           message: "Incorrect password",
//         }),
//         {
//           status: 401,
//         }
//       );
//     }

//     // Update last login timestamp
//     const sessionToken = require("crypto").randomBytes(32).toString("hex");
//     userFromDB.sessionToken = sessionToken;
//     userFromDB.lastLogin = new Date();
//     await userFromDB.save();

//     cookies().set("sessionToken", sessionToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 60 * 60 * 24 * 7, // 1 week
//       path: "/",
//     });
//     cookies().set("role", role, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 60 * 60 * 24 * 7,
//       path: "/",
//     });

//     return new Response(
//       JSON.stringify({
//         message: "Login successful",
//         user: {
//           id: userFromDB._id,
//           username: userFromDB.fullName,
//           email: userFromDB.email,
//           role: userFromDB.role,
//         },
//       }),
//       {
//         status: 200,
//       }
//     );
//   } catch (err) {
//     console.error("Login error:", err);
//     return new Response(
//       JSON.stringify({
//         message: "Server error",
//       }),
//       {
//         status: 500,
//       }
//     );
//   }
// }

// import bcrypt from "bcryptjs";
// import userSchema from "../../models/userSchema";
// import teacher from "../../models/teacherSchema";
// import student from "../../models/studentSchema"; // import student model
// import { connectToDatabase } from "../../lib/mongodb";
// import { cookies } from "next/headers";
// import crypto from "crypto";

import bcrypt from "bcryptjs";
import userSchema from "../../models/userSchema";
import teacherSchema from "../../models/teacherSchema";
import studentSchema from "../../models/studentSchema";
import { connectToDatabase } from "../../lib/mongodb";
import { cookies } from "next/headers";
import crypto from "crypto";


export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, role } = body;

    if (!email || !password || !role) {
      return new Response(
        JSON.stringify({ message: "Email, password, and role are required" }),
        { status: 400 }
      );
    }

    // Validate role
    // validRoles should include variations or we should normalize before checking. 
    // Normalized check:
    const validRoles = ["admin", "superadmin", "student", "staff", "parents", "hod", "teacher", "hr", "accountant"];
    const normalizedRole = role.toLowerCase().replace(/\s+/g, '');

    if (!validRoles.includes(normalizedRole)) {
      return new Response(JSON.stringify({ message: "Invalid role" }), { status: 400 });
    }

    await connectToDatabase();
    const cookieStore = await cookies();

    // HOD or Teacher login
    if (role === "hod" || role === "teacher") {
      const hodUser = await teacherSchema.findOne({ email, role });

      if (!hodUser) {
        return new Response(
          JSON.stringify({ message: `Invalid email or not authorized as ${role}` }),
          { status: 401 }
        );
      }

      const passwordMatch = await bcrypt.compare(password, hodUser.password);
      if (!passwordMatch) {
        return new Response(JSON.stringify({ message: "Incorrect password" }), { status: 401 });
      }

      const sessionToken = crypto.randomBytes(32).toString("hex");
      hodUser.sessionToken = sessionToken;
      hodUser.lastLogin = new Date();
      await hodUser.save();

      cookieStore.set("sessionToken", sessionToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 60 * 60, path: "/" });
      cookieStore.set("role", role, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 60 * 60, path: "/" });

      return new Response(JSON.stringify({
        message: "Login successful",
        user: {
          id: hodUser._id,
          fullName: hodUser.fullName,
          email: hodUser.email,
          role: hodUser.role,
          department: hodUser.department,
          teacherId: hodUser.teacherId,
        },
      }), { status: 200 });
    }

    // Student login logic
    if (role === "student") {
      // 1. First attempt to login via User collection (Prospective Students/Admission Phase)
      const userFromDB = await userSchema.findOne({ email, role: "student" });
      
      if (userFromDB) {
        const passwordMatch = await bcrypt.compare(password, userFromDB.password);
        if (passwordMatch) {
          const sessionToken = crypto.randomBytes(32).toString("hex");
          userFromDB.sessionToken = sessionToken;
          await userFromDB.save();

          cookieStore.set("sessionToken", sessionToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 60 * 60, path: "/" });
          cookieStore.set("role", role, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 60 * 60, path: "/" });

          return new Response(JSON.stringify({
            message: "Student login successful",
            user: {
              id: userFromDB._id,
              fullName: userFromDB.fullName,
              email: userFromDB.email,
              role: "student",
              admissionId: userFromDB.admissionId
            },
          }), { status: 200 });
        }
      }

      // 2. Fallback to legacy Student ID login (Enrolled Students)
      if (email === password) {
        const studentUser = await studentSchema.findOne({ studentId: email });
        if (studentUser) {
          const sessionToken = crypto.randomBytes(32).toString("hex");
          studentUser.sessionToken = sessionToken;
          await studentUser.save();

          cookieStore.set("sessionToken", sessionToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 60 * 60, path: "/" });
          cookieStore.set("role", role, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 60 * 60, path: "/" });

          return new Response(JSON.stringify({
            message: "Student login successful",
            user: {
              id: studentUser._id,
              fullName: studentUser.fullName,
              email: studentUser.email,
              studentId: studentUser.studentId,
              role: "student",
            },
          }), { status: 200 });
        }
      }

      return new Response(JSON.stringify({ message: "Invalid credentials" }), { status: 401 });
    }

    // Admin, Staff, Parents, HR, Superadmin login
    const userFromDB = await userSchema.findOne({ email });
    if (!userFromDB) {
      return new Response(JSON.stringify({ message: "Invalid email or role" }), { status: 401 });
    }
    console.log(userFromDB)
    // Verify that the user's role matches the selected role
    // Normalize both to lowercase and remove spaces to handle "Super Admin" vs "superadmin" mismatch
    const normalizedDbRole = userFromDB.role.toLowerCase().replace(/\s+/g, '');
    const normalizedInputRole = role.toLowerCase().replace(/\s+/g, '');

    if (normalizedDbRole !== normalizedInputRole) {
      return new Response(JSON.stringify({ message: "Invalid role or password" }), { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, userFromDB.password);
    if (!passwordMatch) {
      return new Response(JSON.stringify({ message: "Incorrect password" }), { status: 401 });
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");
    userFromDB.sessionToken = sessionToken;
    userFromDB.lastLogin = new Date();
    await userFromDB.save();

    cookieStore.set("sessionToken", sessionToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 60 * 60, path: "/" });
    cookieStore.set("role", role, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", maxAge: 60 * 60, path: "/" });

    return new Response(JSON.stringify({
      message: "Login successful",
      user: {
        id: userFromDB._id,
        username: userFromDB.fullName,
        email: userFromDB.email,
        // Normalize role to ensure "Super Admin" becomes "superadmin" for frontend consistency
        role: userFromDB.role.toLowerCase().replace(/\s+/g, ''),
      },
    }), { status: 200 });

  } catch (err) {
    console.error("Login error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
