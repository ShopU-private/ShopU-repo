import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { getAuthUserId } from '@/lib/auth';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';

// DELETE - clear all items from the cart
export async function DELETE(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);

    // Delete all cart items for the user
    const result = await prisma.cartItem.deleteMany({
      where: { userId },
    });

    return NextResponse.json(
      { success: true, message: 'Cart cleared successfully', deletedCount: result.count },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
