import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { verifyToken } from '@/lib/auth';

// DELETE - clear all items from the user's cart
export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ success: false, error: 'Please login first' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const userId = payload.userId;

    // Delete all cart items for the user
    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    return NextResponse.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('[DELETE /api/cart/clear]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
