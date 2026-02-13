import { prisma } from '@shopu/prisma/prismaClient';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/proxy/requireAuth';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) return auth.response;

    const user = auth.user;
    if (!user) throw new ShopUError(401, 'Invalid credentials');

    const { id } = await params;

    const address = await prisma.userAddress.findUnique({ where: { id } });

    if (!address || address.userId !== user.id) {
      throw new ShopUError(404, 'Address not found');
    }

    return NextResponse.json({ success: true, message: 'Fetched address successfully',address }, { status: 200 });
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

// Update address
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) return auth.response;

    const user = auth.user;
    if (!user) throw new ShopUError(401, 'Invalid credentials');

    const { id } = await params;
    const body = await req.json();

    const existingAddress = await prisma.userAddress.findUnique({ where: { id } });

    if (!existingAddress || existingAddress.userId !== user.id) {
      throw new ShopUError(404, 'Address not found');
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { id },
      data: {
        addressLine1: body.addressLine1,
        addressLine2: body.addressLine2,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        country: body.country,
        isDefault: body.isDefault,
        fullName: body.fullName,
        phoneNumber: body.phoneNumber,
        latitude: body.latitude,
        longitude: body.longitude,
        pincode: body.pincode,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Address updated successfully', updatedAddress },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

// Delete address
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) return auth.response;

    const user = auth.user;
    if (!user) throw new ShopUError(401, 'Invalid credentials');

    const { id } = await params;

    const existingAddress = await prisma.userAddress.findUnique({ where: { id } });

    if (!existingAddress || existingAddress.userId !== user.id) {
      throw new ShopUError(404, 'Address not found');
    }

    await prisma.userAddress.delete({ where: { id } });

    return NextResponse.json(
      { success: true, message: 'Address deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
