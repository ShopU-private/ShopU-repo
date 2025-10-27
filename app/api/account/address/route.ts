import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { verifyToken } from '@/lib/auth';
import { redis } from '@/caching';

const CACHE_TTL = 3600;
const getUserAddressesKey = (userId: string) => `user:${userId}:addresses`;

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: true, message: 'Need to login first' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    const userId = payload.id;

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const cacheKey = getUserAddressesKey(userId);

    // Try to get from cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      let parsed: unknown = null;
      try {
        parsed = JSON.parse(cached);
        console.log(`✅ Cache HIT for user ${userId} addresses`);
      } catch (e) {
        console.warn('Failed to parse cached addresses, refetching from DB', e);
      }

      if (parsed) {
        return NextResponse.json(
          { success: true, address: parsed, cached: true, message: '⚡ Addresses from cache' },
          { status: 200 }
        );
      }
    }

    // Cache miss: fetch from DB
    console.log(`Cache MISS for user ${userId} addresses - fetching from DB`);

    const addresses = await prisma.userAddress.findMany({
      where: { userId },
    });

    // Write to Redis before returning
    try {
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(addresses));
      console.log(`Cached ${addresses.length} addresses for user ${userId}`);
    } catch (e) {
      console.warn('Failed to cache addresses', e);
    }

    return NextResponse.json(
      { success: true, address: addresses, cached: false, message: 'Addresses from database' },
      { status: 200 }
    );
  } catch (error) {
    console.error('API ERROR at GET /api/account/address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

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

    // Invalidate cache after creating new address
    const cacheKey = getUserAddressesKey(user.id);
    await redis.del(cacheKey);
    console.log(`Invalidated address cache for user ${user.id}`);

    return NextResponse.json({ address: newAddress });
  } catch (error) {
    console.error('API ERROR at POST /api/account/address:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}