import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { requireAuth } from '@/proxy/requireAuth';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';

export async function DELETE(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) {
      return auth.response
    }
    
    const user = auth.user
    const userIdToDelete = user?.id;

    // Delete the user directly on cascade so all related data is also deleted
    const deleteAccount = await prisma.user.delete({
      where: { id: userIdToDelete },
    });

    if (!deleteAccount) {
      throw new ShopUError(401, 'Failed to delete the account');
    }

    // Clear the token cookie
    const response = NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
    
    response.cookies.delete('token')
    return response;
  } catch (error) {
    return shopuErrorHandler(error)
  }
}
