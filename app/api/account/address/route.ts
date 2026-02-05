import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { requireAuth } from '@/proxy/requireAuth';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);

    if (!auth.authenticated) {
      return auth.response;
    }

    const user = auth.user;
    const userId = user?.id;

    if (!userId) {
      throw new ShopUError(401, 'Invalid token');
    }

    const address = await prisma.userAddress.findMany({
      where: { userId },
    });

    if (!address) {
      throw new ShopUError(401, 'Address not found');
    }

    return NextResponse.json(
      { success: true, message: 'Address fetched successfully', address },
      { status: 201 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    const user = auth.user;

    if (!user?.id) {
      throw new ShopUError(401, 'Invalid token');
    }

    const body = await req.json();

    const newAddress = await prisma.userAddress.create({
      data: {
        userId: user.id,
        fullName: body.fullName,
        addressLine1: body.addressLine1,
        city: body.city,
        state: body.state,
        country: body.country,
        postalCode: body.postalCode,
        phoneNumber: body.phoneNumber,
        latitude: body.latitude ? parseFloat(body.latitude) : 0.0,
        longitude: body.longitude ? parseFloat(body.longitude) : 0.0,
        isDefault: false,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Address updated successfully', newAddress },
      { status: 201 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
