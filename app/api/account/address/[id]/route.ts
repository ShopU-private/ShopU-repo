import { NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { AuthenticatedRequest, withAuth } from '@/middlewares';
import { redis } from '@/caching';

const CACHE_TTL = 3600;
const getCacheKey = (userId: string, addressId: string) => `user:${userId}:address:${addressId}`;

export const GET = withAuth(async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid address ID' },
        { status: 400 }
      )
    }

    const cacheKey = getCacheKey(req.user.id, id);

    // try to get from cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(cached);
      } catch (e) {
        // If parse fails, fall through to DB fetch
        console.warn('Failed to parse cached address, refetching from DB', e);
      }

      if (parsed) {
        return NextResponse.json(
          { success: true, message: 'Address details (cached)', data: parsed, cached: true },
          { status: 200 }
        )
      }
    }

    // Cache miss: fetch from DB, write to redis, then return to user
    const address = await prisma.userAddress.findFirst({
      where: {
        id,
        userId: req.user.id
      },
      select: {
        id: true,
        userId: true,
        addressLine1: true,
        addressLine2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        isDefault: true,
        fullName: true,
        phoneNumber: true,
        latitude: true,
        longitude: true,
        pincode: true,
      }
    })

    if (!address) {
      return NextResponse.json(
        { success: false, message: 'Address not found' },
        { status: 403 }
      )
    }

    // Write to redis before returning
    try {
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(address));
    } catch (e) {
      console.warn('Failed to set address cache', e);
    }

    return NextResponse.json(
      { success: true, message: 'Address details(from db)', data: address, cached: false },
      { status: 200 }
    )
  } catch (error) {
    console.error('API ERROR at GET /api/account/address/[id]:', error);
    return NextResponse.json(
      { success: false, message: `Internal server error: ${String(error)}` },
      { status: 500 }
    )
  }
})

export const PATCH = withAuth(async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;
    const body = await req.json();

    const existingAddress = await prisma.userAddress.findFirst({
      where: { id },
    })

    if (!existingAddress || existingAddress.userId !== req.user.id) {
      return NextResponse.json(
        { success: false, message: 'Address not found' },
        { status: 404 }
      )
    }

    if (body.latitude !== undefined || body.longitude !== undefined) {
      const lat = parseFloat(body.latitude);
      const lng = parseFloat(body.longitude);

      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return NextResponse.json(
          { success: false, message: 'Invalid coordinate' },
          { status: 400 }
        )
      }

      body.latitude = lat;
      body.longitude = lng;
    }

    const allowedFields = [
      'addressLine1',
      'addressLine2',
      'city',
      'state',
      'postalCode',
      'country',
      'isDefault',
      'fullName',
      'phoneNumber',
      'latitude',
      'longitude',
      'pincode'
    ]

    const updateData = Object.keys(body)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = body[key];
        return obj;
      }, {} as Record<string, unknown>)

    const updatedAddress = await prisma.userAddress.update({
      where: { id },
      data: updateData
    })

    if (!updatedAddress) {
      return NextResponse.json(
        { success: false, message: 'Failed to update Address' },
        { status: 400 }
      )
    }

    // invalidate cache after update
    const cacheKey = getCacheKey(req.user.id, id);
    await redis.del(cacheKey);

    return NextResponse.json(
      { success: false, message: 'Address updated successfully', data: updatedAddress },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: `Internal server error: ${String(error)}` },
      { status: 500 }
    )
  }
})

export const DELETE = withAuth(async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params;

    const existingAddress = await prisma.userAddress.findFirst({
      where: { id }
    })

    if (!existingAddress || existingAddress.userId !== req.user.id) {
      return NextResponse.json(
        { success: false, message: 'Address not found' },
        { status: 404 }
      )
    }

    // Check if address is used in any orders
    const addressInUse = await prisma.order.findFirst({
      where: {
        addressId: id
      }
    });

    if (addressInUse) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete address. It is associated with existing orders.' },
        { status: 400 }
      )
    }

    await prisma.userAddress.delete({
      where: { id }
    })

    const cacheKey = getCacheKey(req.user.id, id);
    await redis.del(cacheKey);

    return NextResponse.json(
      { success: true, message: 'Address deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('delete address error', error)
    return NextResponse.json(
      { success: false, message: `Internal server error:${String(error)}` },
      { status: 500 }
    )
  }
})