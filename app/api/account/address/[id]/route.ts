import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { requireAuth } from '@/proxy/requireAuth';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    const user = auth.user;
    if (!user) {
      throw new ShopUError(401, 'Invalid credentials');
    }

    const { id } = await params;

    const address = await prisma.userAddress.findUnique({
      where: { id },
    });

    if (!address || address.userId !== user.id) {
      throw new ShopUError(401, 'Address not found');
    }

    return NextResponse.json(
      { success: true, message: 'Fetched user details', address },
      { status: 201 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

//Update address
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    const user = auth.user;
    if (!user) {
      throw new ShopUError(401, 'Invalid credentials');
    }

    const { id } = await params;
    const body = await req.json();

    // Verify the address belongs to the user before updating
    const existingAddress = await prisma.userAddress.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== user.id) {
      throw new ShopUError(401, 'Address not found');
    }

    // Extract only allowed fields
    const {
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
      fullName,
      phoneNumber,
      latitude,
      longitude,
      pincode,
    } = body;

    const updatedAddress = await prisma.userAddress.update({
      where: { id },
      data: {
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
        isDefault,
        fullName,
        phoneNumber,
        latitude,
        longitude,
        pincode,
      },
    });

    return NextResponse.json(
      { success: true, message: 'Address updated successfully', updatedAddress },
      { status: 201 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

//Delete address
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    const user = auth.user;
    if (!user) {
      throw new ShopUError(401, 'Invalid credentials');
    }

    const { id } = await params;

    // Verify the address belongs to the user before deleting
    const existingAddress = await prisma.userAddress.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== user.id) {
      throw new ShopUError(401, 'Address not found');
    }

    const deletedAddress = await prisma.userAddress.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: 'Address deleted successfully', deletedAddress },
      { status: 201 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
