import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { verifyToken } from '@/lib/auth';
import { userAddressSchema } from '@/lib/schema/userAddress.schema';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Please login first' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const userId = payload.id;

    const addresses = await prisma.userAddress.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' }, // Show default address first
    });

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    console.error('[GET /api/account/address]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Please login first' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const userId = payload.id;

    const body = await req.json();
    const parsed = userAddressSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return NextResponse.json({ success: false, error: errors }, { status: 400 });
    }
    const {
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault = false,
    } = parsed.data;

    // Create new address
    const newAddress = await prisma.userAddress.create({
      data: {
        userId,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        isDefault,
      },
    });

    //if curr address is default, update all other to false
    if (isDefault) {
      await prisma.userAddress.updateMany({
        where: {
          userId,
          NOT: { id: newAddress.id },
        },
        data: { isDefault: false },
      });
    }

    return NextResponse.json({ success: true, address: newAddress }, { status: 201 });
  } catch (error) {
    console.error('[POST /api/account/address]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
