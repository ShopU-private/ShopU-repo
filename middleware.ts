import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  const adminRoutes = req.nextUrl.pathname.startsWith('/api/admin');

  if (adminRoutes && !token) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  try {
    if (token) {
      const decoded = verifyToken(token);

      if (adminRoutes && decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
