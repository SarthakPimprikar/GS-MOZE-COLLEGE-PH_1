import { connectToDatabase } from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';

import Student from '@/app/models/studentSchema';
import Teacher from '@/app/models/teacherSchema';
import User from '@/app/models/userSchema';
import Admission from '@/app/models/admissionSchema';
import Enquiry from '@/app/models/enquirySchema';
import Academic from '@/app/models/academicSchema';

export async function GET() {
  try {
    await connectToDatabase(); // this ensures mongoose is connected

    const [
      studentsCount,
      teachersCount,
      hodCounts,
      usersCount,
      hrCount,
      admissionsCount,
      enquiriesCount,
      activeCourseCount
    ] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Teacher.countDocuments({role:'hod'}),
      User.countDocuments({role: 'staff'}),
      User.countDocuments({role: 'hr'}),
      Admission.countDocuments({ status: 'inProcess' }),
      Enquiry.countDocuments({ status: 'New' }),
      Academic.countDocuments({isActive: true})
    ]);

    return NextResponse.json({
      students: studentsCount,
      teachers: teachersCount,
      hod:hodCounts,
      staffs: usersCount,
      hr: hrCount,
      inProcessAdmissions: admissionsCount,
      newEnquiries: enquiriesCount,
      activeCourse: activeCourseCount
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch dashboard data', error: error.message },
      { status: 500 }
    );
  }
}
