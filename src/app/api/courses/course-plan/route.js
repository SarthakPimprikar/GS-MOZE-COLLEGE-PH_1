import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import CoursePlan from "@/app/models/coursePlanSchema"

// export async function GET(request, { params }) {
//   await connectToDatabase();

//   try {
//     const { id } = params;
//     const { searchParams } = new URL(request.url);
//     const populate = searchParams.get('populate') ?? 'true';

//     // Set up population options
//     const populateOptions = [];
//     if (populate === 'true') {
//       populateOptions.push(
//         { path: 'teacherId', select: 'name email' },
//         { path: 'subject', select: 'name code' }
//       );
//     }

//     let queryBuilder = CoursePlan.findById(id);

//     if (populateOptions.length > 0) {
//       queryBuilder = queryBuilder.populate(populateOptions);
//     }

//     const coursePlan = await queryBuilder.lean();

//     if (!coursePlan) {
//       return NextResponse.json(
//         { message: 'Course plan not found' },
//         { status: 404 }
//       );
//     }

//     // Transform data for client
//     const transformedPlan = {
//       ...coursePlan,
//       _id: coursePlan._id.toString(),
//       teacherId: coursePlan.teacherId?._id ? {
//         _id: coursePlan.teacherId._id.toString(),
//         name: coursePlan.teacherId.name,
//         email: coursePlan.teacherId.email
//       } : coursePlan.teacherId,
//       subject: coursePlan.subject?._id ? {
//         _id: coursePlan.subject._id.toString(),
//         name: coursePlan.subject.name,
//         code: coursePlan.subject.code
//       } : coursePlan.subject,
//       modules: coursePlan.modules?.map(module => ({
//         ...module,
//         lessons: module.lessons?.map(lesson => ({
//           ...lesson,
//           _id: lesson._id.toString()
//         })) || []
//       })) || []
//     };

//     return NextResponse.json(transformedPlan);
//   } catch (error) {
//     console.error('Error fetching course plan:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

export async function GET(request) {
  await connectToDatabase();

  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const teacherId = searchParams.get('teacherId');
    const subject = searchParams.get('subject');
    const branch = searchParams.get('branch');
    const year = searchParams.get('year');
    const division = searchParams.get('division');
    const batch = searchParams.get('batch');
    const loadType = searchParams.get('loadType');
    const execute = searchParams.get('execute');
    const populate = searchParams.get('populate') ?? 'true';

    // Build query object
    const query = {};
    if (teacherId) query.teacherId = teacherId;
    if (subject) query.subject = subject;
    if (branch) query.branch = branch;
    if (year) query.year = year;
    if (division) query.division = division;
    if (batch) query.batch = batch;
    if (loadType) query.loadType = loadType;
    if (execute) query.execute = execute === 'true';

    // Set up population options
    const populateOptions = [];
    if (populate === 'true') {
      populateOptions.push(
        { path: 'teacherId', select: 'name email' },
        { path: 'subject', select: 'name code' }
      );
    }

    // Execute query
    let queryBuilder = CoursePlan.find(query);

    if (populateOptions.length > 0) {
      queryBuilder = queryBuilder.populate(populateOptions);
    }

    const coursePlans = await queryBuilder.sort({ createdAt: -1 }).lean();

    // Transform data for client
    const transformedPlans = coursePlans.map(plan => ({
      ...plan,
      _id: plan._id.toString(),
      teacherId: plan.teacherId?._id ? {
        _id: plan.teacherId._id.toString(),
        name: plan.teacherId.name,
        email: plan.teacherId.email
      } : plan.teacherId,
      subject: plan.subject?._id ? {
        _id: plan.subject._id.toString(),
        name: plan.subject.name,
        code: plan.subject.code
      } : plan.subject,
      modules: plan.modules?.map(module => ({
        ...module,
        lessons: module.lessons?.map(lesson => ({
          ...lesson,
          _id: lesson._id.toString()
        })) || []
      })) || []
    }));

    return NextResponse.json(transformedPlans);
  } catch (error) {
    console.error('Error fetching course plans:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}