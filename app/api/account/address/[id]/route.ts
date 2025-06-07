import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const addressId = params.id;

    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Need to login first' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const userId = payload.userId;

    const address = await prisma.userAddress.findFirst({
      where: {
        id: addressId,
        userId: userId,
      },
    });

    if (!address) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, address });
  } catch (error) {
    console.error('[GET /api/account/address/[id]]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - update specific address
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const addressId = params.id;
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Need to login first' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const userId = payload.userId;

    const body = await req.json();
    const { addressLine1, addressLine2, city, state, postalCode, country, isDefault } = body;

    const address = await prisma.userAddress.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }

    const updated = await prisma.userAddress.update({
      where: { id: addressId },
      data: {
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
    if (updated && isDefault) {
      await prisma.userAddress.updateMany({
        where: {
          userId,
          NOT: { id: addressId },
        },
        data: { isDefault: false },
      });
    }

    return NextResponse.json({ success: true, address: updated });
  } catch (error) {
    console.error('[PUT /api/account/address/[id]]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - delete specific address
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const addressId = params.id;
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Need to login first' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const userId = payload.userId;

    const address = await prisma.userAddress.findFirst({
      where: { id: addressId, userId },
    });

    if (!address) {
      return NextResponse.json({ success: false, error: 'Address not found' }, { status: 404 });
    }

    await prisma.userAddress.delete({
      where: { id: addressId },
    });

    return NextResponse.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    console.error('[DELETE /api/account/address/[id]]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
