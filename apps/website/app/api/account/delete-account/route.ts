import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { requireAuth } from '@/proxy/requireAuth';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';

export async function DELETE(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    const userId = auth.user?.id;
    if (!userId) {
      throw new ShopUError(401, 'Invalid token');
    }

    // Cascade delete user and all related data
    await prisma.user.delete({
      where: { id: userId },
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account deleted successfully',
      },
      { status: 200 }
    );

    // Clear auth cookie
    response.cookies.delete('token');

    return response;
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
