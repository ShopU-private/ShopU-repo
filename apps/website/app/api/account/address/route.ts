import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { requireAuth } from '@/proxy/requireAuth';

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) return auth.response;

    const userId = auth.user?.id;
    if (!userId) {
      throw new ShopUError(401, 'Invalid token');
    }

    const addresses = await prisma.userAddress.findMany({
      where: { userId },
    });

    return NextResponse.json(
      {
        success: true,
        addresses,
      },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) return auth.response;

    const userId = auth.user?.id;
    if (!userId) {
      throw new ShopUError(401, 'Invalid token');
    }

    const {
      fullName,
      addressLine1,
      city,
      state,
      country,
      postalCode,
      phoneNumber,
      latitude,
      longitude,
    } = await req.json();

    const newAddress = await prisma.userAddress.create({
      data: {
        userId,
        fullName,
        addressLine1,
        city,
        state,
        country,
        postalCode,
        phoneNumber,
        latitude: latitude ? Number(latitude) : 0,
        longitude: longitude ? Number(longitude) : 0,
        isDefault: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Address created successfully',
        address: newAddress,
      },
      { status: 201 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
