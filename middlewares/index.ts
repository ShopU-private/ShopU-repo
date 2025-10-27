import { verifyToken } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export type AuthenticatedRequest = NextRequest & {
  user: {
    id: string;
    phoneNumber?: string;
    role: string;
  };
};

export function withAuth<Context = unknown>(
  handler: (req: AuthenticatedRequest, context: Context) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: Context) => {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 400 }
      )
    }

    // attach user to request
    (req as AuthenticatedRequest).user = user;

    return handler(req as AuthenticatedRequest, context)
  }
}