import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    // Verify user is authenticated
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Please login first' }, { status: 401 });
    }

    // Verify token and get user details
    const payload = verifyToken(token);
    const userId = payload.id;

    // Find user's default address
    const address = await prisma.userAddress.findFirst({
      where: {
        userId,
        isDefault: true,
      },
    });

    // If no default address, try to find any address
    if (!address) {
      const anyAddress = await prisma.userAddress.findFirst({
        where: {
          userId,
        },
      });

      if (anyAddress) {
        return NextResponse.json({ success: true, address: anyAddress });
      }

      return NextResponse.json({ 
        success: false, 
        error: 'No address found for this user',
        address: null 
      });
    }

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error('[GET /api/addresses/default]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch default address' },
      { status: 500 }
    );
  }
}
