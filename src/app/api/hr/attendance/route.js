import { NextResponse } from 'next/server';
//import { connectToDatabase } from '@/lib/mongoose';
import { connectToDatabase } from '@/app/lib/mongodb';
//import Attendance from '@/models/attendance';
import attendanceSchema from '@/models/attendanceSchema';
import Staff from '@/models/staff';

// export async function GET(request) {
//   await connectToDatabase();

//   const { searchParams } = new URL(request.url);
//   const staffId = searchParams.get('staffId');
//   const date = searchParams.get('date'); // format: YYYY-MM-DD

//   console.log(staffId);
//   let filter = {};

//   if (staffId) {
//     const staff = await Staff.findOne({ staffId });
//     if (!staff) {
//       return NextResponse.json({ success: false, message: 'Staff not found' }, { status: 404 });
//     }
//     filter.staff = staff._id;
//   }

//   if (date) {
//     const day = new Date(date);
//     const start = new Date(day.setHours(0, 0, 0, 0));
//     const end = new Date(day.setHours(23, 59, 59, 999));
//     filter.date = { $gte: start, $lt: end };
//   }

//   try {
//     const records = await attendance.find(filter).populate('staff', 'name staffId');
//     return NextResponse.json({ success: true, data: records });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }

export async function GET(request) {
  await connectToDatabase();

  try {
    // ✅ Always fetch all attendance records
    const records = await attendanceSchema
      .find()
      .populate('staff', 'name staffId department'); // include staff info


      console.log("Record",records);

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}



export async function POST(request) {
  await connectToDatabase();
  const body = await request.json();

  // ✅ 1. Special Case: Mark all staff present today
  if (body.action === 'markAllPresent') {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const allStaff = await Staff.find({ isActive: true });

    let inserted = 0;
    let skipped = 0;

    for (const staff of allStaff) {
      const exists = await attendanceSchema.findOne({
        staff: staff._id,
        date: { $gte: startOfDay, $lt: endOfDay }
      });

      if (exists) {
        skipped++;
        continue;
      }

      await attendanceSchema.create({
        staff: staff._id,
        date: new Date(),
        status: 'Present',
        remarks: 'Auto-marked'
      });

      inserted++;
    }

    return NextResponse.json({
      success: true,
      message: 'Marked all unmarked staff as Present',
      inserted,
      skipped
    });
  }

  

  // ✅ 2. Bulk insert
  if (Array.isArray(body)) {
    const results = { inserted: [], skipped: [] };

    for (const entry of body) {
      const { staffId, date, status, remarks = '' } = entry;
      const staff = await Staff.findOne({ staffId });

      if (!staff) {
        results.skipped.push({ staffId, reason: 'Staff not found' });
        continue;
      }

      const attendanceDate = new Date(date);
      const exists = await attendanceSchema.findOne({
        staff: staff._id,
        date: {
          $gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
          $lt: new Date(attendanceDate.setHours(23, 59, 59, 999))
        }
      });

      if (exists) {
        results.skipped.push({ staffId, reason: 'Already marked' });
        continue;
      }

      const created = await attendanceSchema.create({
        staff: staff._id,
        date: attendanceDate,
        status,
        remarks
      });

      results.inserted.push(created);
    }

    return NextResponse.json({ success: true, ...results });
  }

  // ✅ 3. Single insert
  const { staffId, date, status, remarks = '' } = body;
  console.log("Looking for staffId:", staffId);
  const staff = await Staff.findOne({ staffId });
  console.log("Found staff:", staffId);

  if (!staff) {
    return NextResponse.json({ success: false, message: 'Staff not found' }, { status: 404 });
  }

  const single = await attendanceSchema.create({
    staff: staff._id,
    date: new Date(date),
    status,
    remarks
  });

  return NextResponse.json({ success: true, data: single });
}

export async function PATCH(request) {
  await connectToDatabase();
  const body = await request.json();
  const { staffId, date, status } = body;

  if (!staffId || !date || !status) {
    return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
  }

  const staff = await Staff.findOne({ staffId });
  if (!staff) {
    return NextResponse.json({ success: false, message: 'Staff not found' }, { status: 404 });
  }

  const day = new Date(date);
  const startOfDay = new Date(day.setHours(0, 0, 0, 0));
  const endOfDay = new Date(day.setHours(23, 59, 59, 999));

  const updated = await attendanceSchema.findOneAndUpdate(
    {
      staff: staff._id,
      date: { $gte: startOfDay, $lt: endOfDay }
    },
    { $set: { status } },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ success: false, message: 'Attendance record not found for update' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: updated });
}


