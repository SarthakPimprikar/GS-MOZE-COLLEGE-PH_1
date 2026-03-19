import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import FeeHead from '@/models/feeHead';

export async function PATCH(request, { params }) {
  await connectToDatabase();
  try {
    const { name, description, isActive } = await request.json();
    const {id} = await params;
    const updated = await FeeHead.findByIdAndUpdate(id, {
      name, description, isActive
    }, { new: true });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Fee Head not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await connectToDatabase();
  try {
    const {id} = await params;
    const deleted = await FeeHead.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Fee Head not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Fee Head deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
