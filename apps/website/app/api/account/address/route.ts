import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { getAuthUserId } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const userId = getAuthUserId(req);

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
        message: 'Address fetched successfully',
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
    const userId = getAuthUserId(req);
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

    const requiredFields = { fullName, addressLine1, city, state, country, postalCode, phoneNumber, latitude, longitude };
    let missingFields: string[] | null = null;

    for (const key in requiredFields) {
      if (!requiredFields[key as keyof typeof requiredFields]) {
        (missingFields ??= []).push(key)
      }
    }

    if (missingFields?.length) {
      throw new ShopUError(401, `Missing fields required: ${missingFields.join(', ')}`)
    }

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
