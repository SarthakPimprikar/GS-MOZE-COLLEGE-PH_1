//PUT and DELETE route handler to update and delete enquiry based on id

import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';
import mongoose from 'mongoose';
import enquirySchema from '../../../models/enquirySchema';
import admissionSchema from '../../../models/admissionSchema';

// export async function PUT(req, context) {
//   try {
//     await connectToDatabase();

//     const { params } = context;
//     const { id } = params;
//     const body = await req.json();
//     const { status, counsellorId,followUps } = body;

//     const updateFields = {};
//     const validStatuses = ['New', 'In Progress', "Contacted",'Converted', 'Lost'];

//     // Validate status
//     if (status) {
//       if (!validStatuses.includes(status)) {
//         return NextResponse.json(
//           { message: 'Invalid status value' },
//           { status: 400 }
//         );
//       }
//       updateFields.status = status;
//     }

//     // Validate counsellorId
//     if (counsellorId) {
//       if (!mongoose.Types.ObjectId.isValid(counsellorId)) {
//         return NextResponse.json(
//           { message: 'Invalid counsellorId' },
//           { status: 400 }
//         );
//       }
//       updateFields.counsellorId = counsellorId;
//     }

//    if (followUps && Array.isArray(followUps)) {
//   const existingEnquiry = await enquirySchema.findById(id);

//   if (!existingEnquiry) {
//     return NextResponse.json({ message: 'Enquiry not found' }, { status: 404 });
//   }

//   // Merge existing followUps with new ones
//   const mergedFollowUps = [...(existingEnquiry.followUps || []), ...followUps];
//   updateFields.followUps = mergedFollowUps;
// }


//     if (Object.keys(updateFields).length === 0) {
//       return NextResponse.json(
//         { message: 'No valid fields to update' },
//         { status: 400 }
//       );
//     }

//     const updatedEnquiry = await enquirySchema.findByIdAndUpdate(id, updateFields, { new: true });
//     console.log(updatedEnquiry)
//     if (!updatedEnquiry) {
//       return NextResponse.json({ message: 'Enquiry not found' }, { status: 404 });
//     }

//     // If status is converted, create a partially filled admission form
//     if (status === 'Converted') {
//       const existingAdmission = await admissionSchema.findOne({
//         first: updatedEnquiry.first,
//         last: updatedEnquiry.last,
//         parentMobile: updatedEnquiry.phone
//       });

//       if (!existingAdmission) {
//         const newAdmission = new admissionSchema({
//           first: updatedEnquiry.first,
//           middle: updatedEnquiry.middle,
//           last: updatedEnquiry.last,
//           parentMobile: updatedEnquiry.phone,
//           parentEmail: updatedEnquiry.email,
//           enquiryId: updatedEnquiry._id
//         });

//         await newAdmission.save();
//       }
//     }

//     return NextResponse.json({
//       message: 'Enquiry updated successfully',
//       enquiry: updatedEnquiry
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Error updating enquiry:', error);
//     return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
//   }
// }


// // DELETE /api/enquiry/[id]
// export async function DELETE(_, { params }) {
//   try {
//     await connectToDatabase();
//     const { id } = params;

//     const deleted = await enquirySchema.findByIdAndDelete(id);
//     if (!deleted) {
//       return NextResponse.json({
//         message: 'Enquiry not found'
//       }, {
//         status: 404
//       });
//     }

//     return NextResponse.json({
//       message: 'Enquiry deleted successfully'
//     }, {
//       status: 200
//     });
//   } catch (error) {
//     console.error('Error deleting enquiry:', error);
//     return NextResponse.json({
//       message: 'Server error'
//     }, {
//       status: 500
//     });
//   }
// }


//import { connectToDatabase } from '@/lib/mongodb';
import Enquiry from '../../../models/enquirySchema';

export async function PUT(request) {
  try {
    await connectToDatabase();
    
    // Get the ID from the URL
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { message: 'Enquiry ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.counsellorId) {
      return NextResponse.json(
        { message: 'Counsellor ID is required' },
        { status: 400 }
      );
    }

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return NextResponse.json(
        { message: 'Enquiry not found' },
        { status: 404 }
      );
    }

    const updateData = {
      status: body.status,
      counsellorId: body.counsellorId,
      $push: {}
    };

    if (body.followUps?.length > 0) {
      updateData.$push.followUps = {
        $each: body.followUps.map(fu => ({
          date: new Date(fu.date),
          note: fu.note
        }))
      };
    }

    const updatedEnquiry = await Enquiry.findByIdAndUpdate(id, updateData, {
      new: true
    });

    console.log("updatedEnquiry",updatedEnquiry);

    return NextResponse.json(updatedEnquiry);
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}