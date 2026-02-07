import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { verifyToken } from '@/lib/auth';
import { requireAuth } from '@/proxy/requireAuth';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) {
      return auth.response
    }

    const user = auth.user;
    if (!user) {
      throw new ShopUError(404, 'Failed to fetch the user')
    }

    const userId = user?.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      select: {
        id: true,
        quantity: true,
        productId: true,
        medicineId: true,
        addedAt: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
          },
        },
        medicine: {
          select: {
            id: true,
            name: true,
            price: true,
            manufacturerName: true,
            packSizeLabel: true,
          },
        },
      },
      orderBy: { addedAt: 'desc' },
    });

    return NextResponse.json(
      { success: true, message: 'Cart item fetched', cartItems },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) {
      return auth.response
    }

    const user = auth.user;
    const userId = user?.id;
  } catch (error) {
    return shopuErrorHandler(error)
  }
}
