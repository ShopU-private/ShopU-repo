import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { prisma } from '@/lib/client';
import { generateToken } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// Validate environment variables
const hasRequiredEnvVars = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_SERVICE_ID;

const client = hasRequiredEnvVars ? twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!) : null;

export async function POST(request: NextRequest) {
  try {
    // Check env vars first
    if (!hasRequiredEnvVars || !client) {
      console.error('Missing Twilio environment variables');
      return NextResponse.json(
        { success: false, message: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }
    const { phoneNumber, otp } = await request.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { success: false, message: 'Phone number and OTP are required' },
        { status: 400 }
      )
    }

    // Validate phone number format (10 digits)
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP format' },
        { status: 400 }
      );
    }

    const verification = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_ID!)
      .verificationChecks.create({
        to: `+91${cleanedPhone}`,
        code: otp,
      });

    if (verification.status !== 'approved') {
      return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 401 });
    }

    let user = await prisma.user.findUnique({ where: { phoneNumber } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: uuidv4(),
          phoneNumber,
          role: 'user',
        },
      });
    }

    const token = generateToken({
      id: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });

    const response = NextResponse.json(
      { success: true, messgae: 'OTP verified successfully', token },
      { status: 200 }
    );
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 365 * 24 * 60 * 60 * 1000 * 100,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: `Internal Error: ${String(error)}` }, { status: 500 });
  }
}
