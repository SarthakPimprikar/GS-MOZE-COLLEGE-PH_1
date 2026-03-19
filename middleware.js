// /middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const ADMIN_ONLY_ROUTES = ['/api/admin'];
const HR_ONLY_ROUTES = ['/api/hr'];
const FACULTY_ONLY_ROUTES = ['/api/faculty'];

const verifyToken = async (token) => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return payload;
  } catch (err) {
    console.error('JWT verification failed:', err);
    return null;
  }
};

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const userRole = payload.role;

  if (ADMIN_ONLY_ROUTES.some((path) => pathname.startsWith(path)) && userRole !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }

  if (HR_ONLY_ROUTES.some((path) => pathname.startsWith(path)) && userRole !== 'hr') {
    return NextResponse.json({ error: 'Forbidden: HR only' }, { status: 403 });
  }

  if (FACULTY_ONLY_ROUTES.some((path) => pathname.startsWith(path)) && userRole !== 'faculty') {
    return NextResponse.json({ error: 'Forbidden: Faculty only' }, { status: 403 });
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/api/admin/:path*',
    '/api/hr/:path*',
    '/api/faculty/:path*',
  ],
};

