import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { getAuthUserId } from '@/lib/auth';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';

// GET - get the total number of items in the user's cart
export async function GET(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);

    // Count total items in cart (sum of quantities)
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      select: { quantity: true },
    });

    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const uniqueItemCount = cartItems.length;

    return NextResponse.json(
      {
        success: true,
        count: {
          items: itemCount,
          uniqueItems: uniqueItemCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
