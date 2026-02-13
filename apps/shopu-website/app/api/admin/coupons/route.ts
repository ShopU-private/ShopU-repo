import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { isAdmin } from '@/lib/auth';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { requireAuth } from '@/proxy/requireAuth';

export async function POST(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      throw new ShopUError(404, 'Admin account required');
    }

    const { name, code, discount, maxUsage, expiryDate } = await req.json();

    const requiredFields = { name, code, discount, maxUsage, expiryDate };
    let missingFields: string[] | null = null;

    for (const key in requiredFields) {
      if (!requiredFields[key as keyof typeof requiredFields]) {
        (missingFields ??= []).push(key);
      }
    }

    if (missingFields?.length) {
      throw new ShopUError(401, `Missing fields required: ${missingFields.join(', ')}`);
    }

    // Always save coupon code in uppercase
    const coupon = await prisma.coupon.create({
      data: {
        name,
        code: code.toUpperCase(),
        discount,
        maxUsage,
        expiryDate: new Date(expiryDate),
      },
    });

    if (!coupon) {
      throw new ShopUError(401, 'Failed to create coupons');
    }

    return NextResponse.json(
      { success: true, message: 'Coupon created successfully', coupon },
      { status: 201 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    const user = auth.user;
    if (!user) {
      throw new ShopUError(404, 'Invalid credentials');
    }
    const coupons = await prisma.coupon.findMany({ orderBy: { id: 'desc' } });
    return NextResponse.json(
      { success: true, message: 'Coupons fetched successfully', coupons },
      { status: 200 }
    );
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
