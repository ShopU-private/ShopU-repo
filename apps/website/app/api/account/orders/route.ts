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

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        address: true,
        orderItems: {
          include: {
            product: {
              include: {
                productImages: true,
              },
            },
            combination: {
              include: {
                values: {
                  include: {
                    variantValue: {
                      include: {
                        variantType: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        payments: true,
      },
    });

    // NOTE: findMany always returns an array
    return NextResponse.json(
      {
        success: true,
        orders,
      },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
