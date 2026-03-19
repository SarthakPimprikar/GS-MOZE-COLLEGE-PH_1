import { connectToDatabase } from '@/lib/mongoose';
import Student from '@/app/models/studentSchema';
import User from '@/app/models/userSchema';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

    const studentData = isValidObjectId
      ? await Student.findOne({ $or: [{ _id: id }, { studentId: id }] })
      : await Student.findOne({ studentId: id });

    if (!studentData) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(studentData, { status: 200 });
  } catch (error) {
    console.error('[GET_STUDENT_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const data = await req.json();

    const filter = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { studentId: id };
    const updatedStudent = await Student.findOneAndUpdate(filter, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedStudent) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Student updated successfully', student: updatedStudent });
  } catch (error) {
    console.error('[UPDATE_STUDENT_ERROR]', error);
    return NextResponse.json({ message: 'Error updating student', error }, { status: 500 });
  }
}


export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const filter = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { studentId: id };

    // First find the student to get associated data
    const student = await Student.findOne(filter);
    
    if (!student) {
      return NextResponse.json({ message: 'Student not found' }, { status: 404 });
    }

    // Delete the associated User record (using studentId as username)
    await User.findOneAndDelete({ username: student.studentId });

    // Delete the student record
    const deletedStudent = await Student.findOneAndDelete(filter);

    console.log(`✅ Deleted student: ${deletedStudent.studentId} and associated user record`);

    return NextResponse.json({ 
      message: 'Student and associated user deleted successfully', 
      student: deletedStudent 
    }, { status: 200 });
  } catch (error) {
    console.error('[DELETE_STUDENT_ERROR]', error);
    return NextResponse.json({ message: 'Error deleting student', error }, { status: 500 });
  }
}
