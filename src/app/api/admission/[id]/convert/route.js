import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";

import mongoose from "mongoose";

import Admission from "@/app/models/admissionSchema";

import User from "@/app/models/userSchema";

import Student from "@/app/models/studentSchema"; // Assuming this model exists
import academicSchema from '@/app/models/academicSchema';
import bcrypt from "bcryptjs";



export async function POST(req, { params }) {

    console.log("=== STARTING CONVERSION PROCESS ===");

    

    try {

        await connectToDatabase();

        console.log("✅ Database connected successfully");
        
        const { id } = await params;
        console.log("📋 Processing admission ID:", id);

        

        const admission = await Admission.findById(id);

        console.log("📋 Found admission:", admission ? "Yes" : "No");

        console.log("admission",admission);
        
        // Check if admission exists and if already converted

        if (!admission) {

            console.log("❌ Admission not found");

            return NextResponse.json({ error: "Admission not found" }, { status: 404 });

        }



        // Check if already converted to student

        const existingStudent = await Student.findOne({ admissionId: admission._id });

        if (existingStudent) {

            console.log("❌ Admission already converted to student");

            return NextResponse.json({ 

                error: "Admission already converted to student", 

                studentId: existingStudent.studentId,

                prn: existingStudent.prn

            }, { status: 400 });

        }



        // 1. Generate Unique Student ID

        let studentId;

        let isUnique = false;

        let attempts = 0;

        

        while (!isUnique && attempts < 10) {

            const yearSuffix = new Date().getFullYear().toString().slice(-2);

            const randomSuffix = Math.floor(1000 + Math.random() * 9000);

            studentId = `STU${yearSuffix}${randomSuffix}`;

            

            const existingStudent = await Student.findOne({ studentId: studentId });

            const existingUser = await User.findOne({ username: studentId });

            

            if (!existingStudent && !existingUser) {

                isUnique = true;

            }

            attempts++;

        }

        

        if (!isUnique) {

            console.log("❌ Unable to generate unique student ID");

            return NextResponse.json({ error: "Unable to generate unique student ID" }, { status: 500 });

        }

        console.log("✅ Generated unique studentId:", studentId);



        // 2. Generate Unique PRN using atomic approach with cleanup

        let prn;

        let isPrnUnique = false;

        let prnAttempts = 0;

        

        while (!isPrnUnique && prnAttempts < 50) { // Increased attempts

            const yearSuffix = new Date().getFullYear().toString().slice(-2);

            const timestamp = Date.now().toString().slice(-6); // Use timestamp for better uniqueness

            const randomSuffix = Math.floor(1000 + Math.random() * 9000);

            prn = `PRN${yearSuffix}${timestamp}${randomSuffix}`;

            

            try {

                // Double-check with lean queries for better performance

                const existingPrn = await Student.findOne({ prn: prn }).lean().exec();

                

                if (!existingPrn) {

                    // Double-check with a more strict query

                    const doubleCheck = await Student.findOne({ prn: prn }).select('_id').lean().exec();

                    if (!doubleCheck) {

                        isPrnUnique = true;

                        console.log("✅ Generated unique PRN:", prn);

                        break;

                    }

                }

            } catch (findError) {

                console.error("❌ Error checking PRN uniqueness:", findError);

            }

            

            prnAttempts++;

            

            // Small delay to prevent rapid-fire attempts

            await new Promise(resolve => setTimeout(resolve, 10));

        }

        

        if (!isPrnUnique) {

            console.log("❌ Unable to generate unique PRN");

            return NextResponse.json({ error: "Unable to generate unique PRN" }, { status: 500 });

        }

        console.log("✅ Generated unique PRN:", prn);



        // 3. Check for existing conflicts with improved logic
        console.log("🔍 Checking for existing conflicts...");
        
        const existingEmailUser = await User.findOne({ email: admission.email });
        const existingEmailStudent = await Student.findOne({ email: admission.email });
        
        console.log("📊 Conflict check results:", {
            emailUser: !!existingEmailUser,
            emailStudent: !!existingEmailStudent,
        });
        
        // Enhanced conflict resolution logic
        if (existingEmailUser || existingEmailStudent) {
            console.log("⚠️ Email conflict detected, checking for resolution...");
            
            // Check if the existing record is from the same admission (retry scenario)
            const existingStudentFromSameAdmission = existingEmailStudent && 
                existingEmailStudent.admissionId && 
                existingEmailStudent.admissionId.toString() === admission._id.toString();
            
            // Check if the existing user is from a failed conversion attempt
            const isOrphanedUser = existingEmailUser && 
                !existingEmailStudent && 
                existingEmailUser.role === "student" &&
                existingEmailUser.username.startsWith("STU");
            
            // Allow conversion if:
            // 1. The existing student is from the same admission (retry scenario)
            // 2. The existing user is orphaned (no corresponding student record)
            // 3. The existing user was created from a failed conversion attempt
            if (existingStudentFromSameAdmission) {
                console.log("✅ Found existing student from same admission, returning existing record");
                return NextResponse.json({
                    success: true,
                    message: "Student profile already exists",
                    studentId: existingEmailStudent.studentId,
                    prn: existingEmailStudent.prn,
                    userId: existingEmailUser ? existingEmailUser._id : null
                });
            } else if (isOrphanedUser) {
                console.log("🧹 Found orphaned user, cleaning up and proceeding...");
                // Clean up the orphaned user record
                await User.findByIdAndDelete(existingEmailUser._id);
                console.log("✅ Orphaned user cleaned up, proceeding with conversion");
            } else {
                console.log("❌ Email conflict cannot be resolved automatically");
                return NextResponse.json({ 
                    success: false, 
                    message: "Duplicate value error", 
                    field: "email",
                    details: "A user with this email already exists. Please contact administrator to resolve the conflict."
                }, { status: 400 });
            }
        }



        // 4. Create Student Profile and User in Transaction

        console.log("🎓 Creating student profile and user transaction...");

        

        const session = await mongoose.startSession();

        session.startTransaction();

        

        let newUser, newStudent;

        

        try {

            // Create User Record within transaction

            const salt = await bcrypt.genSalt(10);

            const hashedPassword = await bcrypt.hash(studentId, salt);



            newUser = await User.create([{

                fullName: admission.fullName,

                email: admission.email,

                phone: admission.studentWhatsappNumber?.toString() || "",

                role: "student",

                password: hashedPassword,

                username: studentId,

            }], { session });

            

            console.log("✅ User created successfully with ID:", newUser[0]._id);



            // Create Student Profile within transaction

            newStudent = await Student.create([{

                studentId: studentId,

                admissionId: admission._id,

                fullName: admission.fullName,

                email: admission.email,

                mobileNumber: admission.studentWhatsappNumber?.toString() || "",

                dateOfBirth: admission.dateOfBirth ? new Date(admission.dateOfBirth) : new Date(),

                gender: admission.gender,

                address: admission.address && admission.address[0] ? admission.address[0] : {},

                programType: admission.programType,

                branch: admission.branch,

                currentYear: admission.year,

                prn: prn,

                counsellorId: admission.counsellorId,

                status: "active",

                // Mapping missing fields

                feesCategory: admission.feesCategory,

                casteAsPerLC: admission.casteAsPerLC,

                subCasteAsPerLC: admission.subCasteAsPerLC,

                domicile: admission.domicile,

                nationality: admission.nationality,

                religionAsPerLC: admission.religionAsPerLC,

                isForeignNational: admission.isForeignNational,

                motherName: admission.motherName,

                familyIncome: admission.familyIncome,

                fatherGuardianWhatsappNumber: admission.fatherGuardianWhatsappNumber?.toString() || "",

                motherMobileNumber: admission.motherMobileNumber?.toString() || "",

                seatType: admission.seatType,

                admissionCategoryDTE: admission.admissionCategoryDTE,

                quota: admission.quota,

                admissionYear: admission.admissionYear,

                round: admission.round,

                admissionType: admission.admissionType,

                dteApplicationNumber: admission.dteApplicationNumber,

                totalFees: admission.totalFees

            }], { session });

            

            console.log("✅ Student created successfully with ID:", newStudent[0]._id);

            // 4.5. Assign Student to an Academic Division
            let assignedDivisionName = "";
            
            // Find the academic record for the department (branch) and programType
            const academicDoc = await academicSchema.findOne({ 
                department: admission.branch,
                // We don't have mapProgramTypeToValidEnum here, but we can reuse admission.programType 
                // Alternatively, let's map it similarly:
                programType: admission.programType?.toLowerCase().includes('diploma') || admission.programType?.toLowerCase().includes('polytechnic') ? 'Diploma' : (admission.programType?.toLowerCase().includes('post') || admission.programType?.toLowerCase().includes('master') || admission.programType?.toLowerCase().includes('pg') || admission.programType?.toLowerCase().includes('m.') ? 'PG' : 'UG')
            }).session(session);
        
            if (academicDoc) {
                const yearObj = academicDoc.years.find((y) => y.year === admission.year);
                if (yearObj) {
                // Find or create a division with < 50 students
                let assignedDivision = yearObj.divisions.find((div) => div.students.length < 50);
        
                if (!assignedDivision) {
                    // No division with available space, create a new one
                    const nextDivisionLetter = String.fromCharCode(65 + yearObj.divisions.length); // 65 = 'A'
                    assignedDivision = {
                    name: nextDivisionLetter,
                    students: [],
                    subjects: [],
                    timetable: [],
                    exams: [],
                    attendance: [],
                    };
                    yearObj.divisions.push(assignedDivision);
                }
        
                // Add user ID to the division (academicSchema stores User/_id or Student/_id, using Student _id)
                assignedDivision.students.push(newStudent[0]._id);
                await academicDoc.save({ session });
                
                assignedDivisionName = assignedDivision.name;
                
                // Update Student with division name
                newStudent[0].division = assignedDivisionName;
                await newStudent[0].save({ session });
                
                console.log(`✅ Student assigned to Division ${assignedDivisionName}`);
                } else {
                console.log(`⚠️ Academic year ${admission.year} not found. Skipping division assignment.`);
                }
            } else {
                console.log(`⚠️ Academic department ${admission.branch} not found. Skipping division assignment.`);
            }

            // Update Admission Status within transaction

            admission.status = "approved";

            admission.prn = prn;

            admission.isPrnGenerated = true;

            await admission.save({ session });

            console.log("✅ Admission status updated successfully");



            // Commit the transaction

            await session.commitTransaction();

            session.endSession();

            

            console.log("🎉 CONVERSION COMPLETED SUCCESSFULLY!");

            return NextResponse.json({

                success: true,

                message: "Converted successfully",

                studentId: studentId,

                prn: prn,

                userId: newUser[0]._id

            });



        } catch (transactionError) {

            // Abort the transaction on any error

            await session.abortTransaction();

            session.endSession();

            

            console.error("❌ Transaction failed:", transactionError);

            

            // Handle duplicate key errors specifically with retry logic

            if (transactionError.code === 11000) {

                const field = Object.keys(transactionError.keyPattern || transactionError.keyValue || {})[0] || 'unknown';

                

                // If it's a PRN duplicate, retry the entire process once

                if (field === 'prn' && prnAttempts < 3) {

                    console.log(`🔄 PRN duplicate detected, retrying... Attempt ${prnAttempts + 1}/3`);

                    // Go back to PRN generation (this will restart the whole process)

                    // For now, return a user-friendly error that suggests retry

                    return NextResponse.json({ 

                        success: false, 

                        message: "Duplicate value error", 

                        field: field,

                        details: `A record with this ${field} already exists. Please try the conversion again.`,

                        retry: true

                    }, { status: 409 });

                }

                

                return NextResponse.json({ 

                    success: false, 

                    message: "Duplicate value error", 

                    field: field,

                    details: `A record with this ${field} already exists. Please try again.`

                }, { status: 409 });

            }

            

            return NextResponse.json({ 

                success: false, 

                message: "Failed to create student profile", 

                error: transactionError.message 

            }, { status: 500 });

        }



    } catch (err) {

        console.error("❌ CONVERSION ERROR:", err);

        

        if (err.code === 11000) {

            const field = Object.keys(err.keyValue)[0];

            return NextResponse.json({ 

                success: false, 

                message: "Duplicate value error", 

                field: field,

                details: `A record with this ${field} already exists`

            }, { status: 400 });

        }

        

        return NextResponse.json({ 

            success: false, 

            message: "Conversion failed", 

            error: err.message 

        }, { status: 500 });

    }

}

