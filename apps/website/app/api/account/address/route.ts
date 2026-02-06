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

    const normalizedAddresses = addresses.map(address => ({
      ...address,
      fullName: address.fullName ?? '',
      addressLine1: address.addressLine1 ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      country: address.country ?? '',
      postalCode: address.postalCode ?? '',
      phoneNumber: address.phoneNumber ?? '',
    }));

    return NextResponse.json(
      {
        success: true,
        addresses: normalizedAddresses,
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
      addressLine2,
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
        addressLine2: addressLine2 || null,
        city,
        state,
        country,
        postalCode,
        phoneNumber,
        latitude: latitude !== undefined && latitude !== null ? Number(latitude) : null,
        longitude: longitude !== undefined && longitude !== null ? Number(longitude) : null,
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
