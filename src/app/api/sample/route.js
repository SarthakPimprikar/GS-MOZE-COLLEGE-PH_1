// sample to post student for sample 50 data 

// app/api/student/add/route.js

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import mongoose from 'mongoose';
import sampleSchema from '../../models/sampleSchema'; // student model
import academicSchema from '../../models/academicSchema'; // academic model

export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const {
      studentId,
      fullName,
      email,
      mobileNumber,
      dateOfBirth,
      address,
      departmentName,
      year,
    } = body;

    // 1. Create the student
    const newStudent = await sampleSchema.create({
      studentId,
      fullName,
      email,
      mobileNumber,
      dateOfBirth,
      address,
      departmentName,
    });

    // 2. Find the academic record and correct year
    const academicDoc = await academicSchema.findOne({ department: departmentName });

    if (!academicDoc) {
      return NextResponse.json({ error: 'Academic record not found' }, { status: 404 });
    }

    const yearObj = academicDoc.years.find((y) => y.year === year);

    if (!yearObj) {
      return NextResponse.json({ error: `Year ${year} not found in department` }, { status: 404 });
    }

    // 3. Find or create a division with < 50 students
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

    // 4. Add student to the division
    assignedDivision.students.push(newStudent._id);

    // 5. Save academic document
    await academicDoc.save();

    return NextResponse.json({
      message: `Student added to ${departmentName} - Year: ${year} - Division: ${assignedDivision.name}`,
      student: newStudent,
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}