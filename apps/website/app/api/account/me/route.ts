import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { requireAuth } from '@/proxy/requireAuth';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    const userId = auth.user?.id;
    if (!userId) {
      throw new ShopUError(401, 'Invalid token');
    }

    const userDetails = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
        isProfileComplete: true,
      },
    });

    if (!userDetails) {
      throw new ShopUError(404, 'User not found');
    }

    return NextResponse.json(
      {
        success: true,
        user: userDetails,
      },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
