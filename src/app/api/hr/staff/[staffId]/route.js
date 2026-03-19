import { NextResponse } from 'next/server';
//import { connectToDatabase } from '@/lib/mongoose';
import { connectToDatabase } from '@/app/lib/mongodb';
import Staff from '@/models/staff';
import Teacher from '@/app/models/teacherSchema';

// GET /api/staff/[staffId]
export async function GET(req, { params }) {
  const { staffId } = params;

  try {
    await connectToDatabase();

    const staff = await Staff.findOne({ staffId });

    if (!staff) {
      return NextResponse.json({ error: 'Staff not found' }, { status: 404 });
    }

    return NextResponse.json(staff, { status: 200 });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  await connectToDatabase();
  const { staffId } = params;
  const { month, year } = await req.json();

  try {
    const staff = await Staff.findOne({ staffId });
    if (!staff) {
      return NextResponse.json({ success: false, message: 'Staff not found' }, { status: 404 });
    }

    // Here you calculate/generate the payslip
    const payslip = {
      staffId: staff.staffId,
      name: staff.name,
      department: staff.department,
      designation: staff.designation,
      month,
      year,
      dateOfIssue: new Date(),
      earnings: {
        basic: staff.salary,
        hra: staff.salary * 0.2,
        da: staff.salary * 0.1,
        specialallowance: 500,
        bonus: 1000,
        grossEarnings: staff.salary + staff.salary * 0.2 + staff.salary * 0.1 + 500 + 1000,
      },
      deductions: {
        pf: 200,
        tds: 150,
        loan: 0,
        leave: 0,
        other: 0,
      },
      totalDeductions: 350,
      netSalary:  staff.salary + staff.salary * 0.2 + staff.salary * 0.1 + 500 + 1000 - 350,
      paymentStatus: 'Paid'
    };

    return NextResponse.json({ success: true, data: [payslip] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}


export async function PUT(request, { params }) {
  await connectToDatabase();
  const { id } = params;

  try {
    const body = await request.json();

    // Try staff first
    let updated = await Staff.findByIdAndUpdate(id, body, { new: true });
    if (!updated) {
      updated = await Teacher.findByIdAndUpdate(id, body, { new: true });
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();
  

  try {
    const { staffId } = params;
    console.log("Staff ID",staffId);
    // Try deleting from Staff
    let deleted = await Staff.findByIdAndDelete({staffId});
    if (!deleted) {
      deleted = await Teacher.findByIdAndDelete(staffId);
    }

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}