import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';
import { generateToken } from '@/lib/auth';
import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp } = await request.json();

    let user = await prisma.user.findUnique({ where: { phoneNumber } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          phoneNumber,
          role: 'USER',
        },
      });
    }

    if (otp !== '111111') {
      throw new ShopUError(401, 'Invalid OTP');
    }

    const token = generateToken({
      id: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });

    const response = NextResponse.json(
      { success: true, message: 'Logged in successfully', user },
      { status: 201 }
    );
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 24 * 60 * 1000,
    });

    await prisma.user.update({
      where: { phoneNumber: phoneNumber },
      data: {
        isPhoneVerified: true,
        lastLoginAt: new Date()
      }
    })
    return response;
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
