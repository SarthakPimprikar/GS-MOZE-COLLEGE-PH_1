import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import Admission from "@/app/models/admissionSchema";
import Student from "@/app/models/studentSchema";
import Academic from "@/app/models/academicSchema";
import ImportedFile from "@/app/models/importedFileSchema";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import * as XLSX from "xlsx";

export async function POST(request) {
  let validationErrors = [];
  let importedFileRecord = null;
  let jsonData = [];
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log("Mongodb connected");

    // Get the form data
    const formData = await request.formData();
    const file = formData.get("file");
    const counsellorId = formData.get("counsellorId");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!counsellorId) {
      return NextResponse.json({ error: "Counsellor ID is required" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "imported-excel");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory already exists, continue
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${originalName}`;
    const filePath = path.join(uploadsDir, fileName);

    // Save file to filesystem
    const buffer = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));

    // Create imported file record in database
    importedFileRecord = new ImportedFile({
      fileName: fileName,
      originalFileName: originalName,
      filePath: `/uploads/imported-excel/${fileName}`,
      fileSize: file.size,
      mimeType: file.type,
      importedBy: counsellorId,
      status: "processing"
    });

    await importedFileRecord.save();
    console.log("Imported file record saved:", importedFileRecord);

    // Convert the file to buffer for processing
    let workbook;
    try {
      workbook = XLSX.read(buffer);
    } catch (xlsxError) {
      console.error("XLSX read error:", xlsxError);
      await ImportedFile.findByIdAndUpdate(importedFileRecord._id, {
        status: "failed",
        totalRecords: 0,
        importedRecords: 0,
        duplicateRecords: 0,
        errorRecords: 1,
        importErrors: [{
          row: "File",
          error: `Invalid Excel file format: ${xlsxError.message}`,
          data: null
        }]
      });
      return NextResponse.json({
        error: "Invalid Excel file format",
        details: xlsxError.message
      }, { status: 400 });
    }

    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    jsonData = XLSX.utils.sheet_to_json(worksheet);
    console.log("Parsed Excel data:", jsonData.length, "rows");

    if (jsonData.length === 0) {
      return NextResponse.json(
        { error: "No data found in Excel file" },
        { status: 400 }
      );
    }

    // Define required columns
    const requiredColumns = [
      "DTEApplicationNumber",
      "FirstName",
      "Email",
      "StudentWhatsappNo",
    ];

    // Get header row (first row)
    const headers = Object.keys(jsonData[0]);

    // Check if all required columns exist
    const missingColumns = requiredColumns.filter(
      (col) => !headers.includes(col)
    );

    if (missingColumns.length > 0) {
      // Update imported file record with validation errors
      await ImportedFile.findByIdAndUpdate(importedFileRecord._id, {
        status: "failed",
        totalRecords: jsonData.length,
        importedRecords: 0,
        duplicateRecords: 0,
        errorRecords: jsonData.length,
        importErrors: [{
          row: "Header",
          error: `Missing required columns: ${missingColumns.join(", ")}`,
          data: { missingColumns, availableHeaders: headers }
        }]
      });

      return NextResponse.json(
        {
          error: "Validation errors found",
          details: `Missing required columns: ${missingColumns.join(", ")}`,
          invalidRecords: jsonData.length,
        },
        { status: 400 }
      );
    }

    // Map Excel columns to schema fields
    const mappedData = jsonData.map((row, index) => {
      try {
        const firstName = row.FirstName?.toString().trim() || "";
        const lastName = row.LastName?.toString().trim() || "";
        const fullName = `${firstName} ${lastName}`.trim();
        const email = row.Email?.toString().trim().toLowerCase();

        if (!email) throw new Error("Email is required");
        if (!fullName) throw new Error("Full Name (First Name) is required");

        return {
          dteApplicationNumber: row.DTEApplicationNumber?.toString().trim(),
          firstName: row.FirstName?.toString().trim(),
          lastName: lastName,
          fullName: fullName,
          email: email,
          studentWhatsappNumber: row.StudentWhatsappNo?.toString().trim(),
          branch: row.Branch?.toString().trim() || "Computer Engineering",
          programType: row.ProgramType?.toString().trim() || "Engineering",
          year: row.Year?.toString().trim() || "First Year",
          round: row.Round?.toString().trim() || "Round 1",
          seatType: row.SeatType?.toString().trim() || "General",
          admissionCategoryDTE: row.AdmissionCategoryDTE?.toString().trim() || "General",
          gender: row.Gender?.toString().trim() || "Not Specified",
          motherName: row.MotherName?.toString().trim() || "",
          fatherGuardianWhatsappNumber: row.FatherGuardianWhatsappNo?.toString().trim() || "",
          casteAsPerLC: row.CasteAsPerLC?.toString().trim() || "",
          domicile: row.Domicile?.toString().trim() || "Maharashtra",
          nationality: row.Nationality?.toString().trim() || "Indian",
          familyIncome: row.FamilyIncome?.toString().trim() || "",
          admissionYear: row.AdmissionYear?.toString().trim() || new Date().getFullYear().toString(),
          dateOfBirth: row.DateofBirth ? new Date(row.DateofBirth) : null,
          status: "inProcess",
          counsellorId: counsellorId,
        };
      } catch (error) {
        validationErrors.push({
          row: index + 2, // +2 because Excel rows start from 1 and header is row 1
          errors: [`Data mapping error: ${error.message}`],
          data: row,
        });
        return null;
      }
    }).filter(Boolean); // Remove null entries

    // Check for duplicates
    const existingApplications = await Admission.find({
      dteApplicationNumber: { $in: mappedData.map(item => item.dteApplicationNumber) }
    });

    const duplicates = [];
    const dataToInsert = [];

    mappedData.forEach((item) => {
      const isDuplicate = existingApplications.some(
        existing => existing.dteApplicationNumber === item.dteApplicationNumber
      );

      if (isDuplicate) {
        duplicates.push({
          dteApplicationNumber: item.dteApplicationNumber,
          fullName: item.fullName,
          rowNumber: item.rowNumber
        });
      } else {
        dataToInsert.push(item);
      }
    });

    // Insert non-duplicate data
    let result = [];
    if (dataToInsert.length > 0) {
      result = await Admission.insertMany(dataToInsert);
      console.log("Data inserted successfully");
    }

    // Update imported file record with success status
    await ImportedFile.findByIdAndUpdate(importedFileRecord._id, {
      status: "completed",
      totalRecords: jsonData.length,
      importedRecords: result.length,
      duplicateRecords: duplicates.length,
      errorRecords: validationErrors.length,
      importErrors: validationErrors
    });

    console.log("Imported file record updated successfully");

    return NextResponse.json({
      message: "Data imported successfully",
      totalRecords: jsonData.length,
      insertedCount: result.length,
      duplicateCount: duplicates.length,
      validationErrorCount: validationErrors.length,
      duplicates: duplicates,
      validationErrors: validationErrors,
    });

  } catch (error) {
    console.error("Import error:", error);

    // Update imported file record with error status
    if (importedFileRecord && importedFileRecord._id) {
      try {
        await ImportedFile.findByIdAndUpdate(importedFileRecord._id, {
          status: "failed",
          totalRecords: jsonData?.length || 0,
          importedRecords: 0,
          duplicateRecords: 0,
          errorRecords: jsonData?.length || 0,
          importErrors: [{
            row: "System",
            error: error.message,
            data: null
          }]
        });
      } catch (updateError) {
        console.error("Failed to update imported file record:", updateError);
      }
    }

    return NextResponse.json(
      {
        error: "Failed to import data",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

async function handleApprovedStatus(applications) {
  try {
    for (const admission of applications) {
      if (admission.status === "approved") {
        // Create student record
        const student = new Student({
          prn: generatePRN(),
          fullName: admission.fullName,
          email: admission.email,
          studentWhatsappNumber: admission.studentWhatsappNumber,
          branch: admission.branch,
          programType: admission.programType,
          year: admission.year,
          counsellorId: admission.counsellorId,
        });

        const savedStudent = await student.save();

        // Update academic record
        await updateAcademicRecord(savedStudent, admission);
      }
    }
  } catch (error) {
    console.error("Error in handleApprovedStatus:", error);
  }
}

function generatePRN() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${year}${random}`;
}

async function updateAcademicRecord(student, admission) {
  try {
    const academicRecord = await Academic.findOne({
      branch: admission.branch,
      programType: admission.programType,
    });

    if (!academicRecord) {
      // Create new academic record if not exists
      const newAcademic = new Academic({
        branch: admission.branch,
        programType: admission.programType,
        years: [
          {
            year: admission.year,
            divisions: [
              {
                name: "A",
                students: [student._id],
                subjects: [],
                timetable: [],
                exams: [],
                attendance: [],
              },
            ],
          },
        ],
      });
      await newAcademic.save();
    } else {
      const yearIndex = academicRecord.years.findIndex(
        (y) => y.year === admission.year
      );

      if (yearIndex === -1) {
        // Add new year
        academicRecord.years.push({
          year: admission.year,
          divisions: [
            {
              name: "A",
              students: [student._id],
              subjects: [],
              timetable: [],
              exams: [],
              attendance: [],
            },
          ],
        });
        await academicRecord.save();
      } else {
        const yearBlock = academicRecord.years[yearIndex];
        const targetDivision = yearBlock.divisions[0]; // Default to first division

        if (targetDivision.students.length >= 60) {
          // Create new division if current one is full
          const newDivisionName = String.fromCharCode(
            65 + yearBlock.divisions.length
          );
          await Academic.findByIdAndUpdate(
            academicRecord._id,
            {
              $push: {
                "years.$[yearElem].divisions": {
                  name: newDivisionName,
                  students: [student._id],
                  subjects: [],
                  timetable: [],
                  exams: [],
                  attendance: [],
                },
              },
            },
            {
              arrayFilters: [{ "yearElem.year": admission.year }],
            }
          );
        } else {
          // Add student to existing division
          await Academic.updateOne(
            {
              _id: academicRecord._id,
              "years.year": admission.year,
              "years.divisions.name": targetDivision.name,
            },
            {
              $push: {
                "years.$.divisions.$.students": student._id,
              },
            }
          );
        }
      }
    }
  } catch (error) {
    console.error("Error updating academic record:", error);
  }
}
