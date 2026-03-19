import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';

import Staff from '@/models/staff';
import { Salary } from '@/models/payroll';
import {Payslip} from '@/models/payroll';
import Leave from '@/models/leave';
import StaffInfo from '@/models/staffinfo';

export async function POST() {
  await connectToDatabase();

  try {
    const staffList = await Staff.find();

    for (const staff of staffList) {
      const staffId = staff.staffId;

      // Fetch related records using staff._id
      const salary = await Salary.findOne({ staffId: staff._id });
      const payslips = await Payslip.find({ staffId: staff._id });
      const leaves = await Leave.find({ staffId: staff._id });

      // Prepare the full document
      const staffInfoPayload = {
        staffId,
        name: staff.name,
        designation: staff.designation,
        department: staff.department,
        email: staff.email,
        phone: staff.phone,
        joiningDate: staff.joiningDate,

        currentSalary: {
          base: salary?.baseSalary || 0,
          allowances: salary?.allowances || 0,
          deductions: salary?.deductions || 0,
          effectiveFrom: salary?.effectiveFrom || staff.joiningDate
        },

        leaveBalance: {
          sick: staff.leaveCount || 10,
          casual: 10,
          other: 5
        },

        leaves,
        salaryHistory: salary ? [{
          base: salary.baseSalary,
          allowances: salary.allowances,
          deductions: salary.deductions,
          leaveDeduction: 0,
          effectiveFrom: salary.effectiveFrom || staff.joiningDate
        }] : [],

        payslips
      };

      // Insert or update in StaffInfo collection
      await StaffInfo.findOneAndUpdate(
        { staffId },
        staffInfoPayload,
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({ success: true, message: 'All staff aggregated into StaffInfo collection' });

  } catch (error) {
    console.error('Error during aggregation:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
