import { NextResponse } from 'next/server';

export async function GET() {
  // Return an empty array or mock data for classes as the schema doesn't exist yet
  return NextResponse.json([], { status: 200 });
}
