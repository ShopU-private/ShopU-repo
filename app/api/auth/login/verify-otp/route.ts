import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { prisma } from '@/lib/client';
import { generateToken } from '@/lib/auth';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;

if (!accountSid || !authToken || !serviceId) {
    throw new Error('Missing Twilio credentials');
}

const client = twilio(accountSid, authToken);

export async function POST(request: NextRequest) {
    try {
        const { phoneNumber, otp } = await request.json();

        if (!phoneNumber || !otp) {
            return NextResponse.json({ success: false, message: "Phone number and OTP are required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { phoneNumber },
        });

        if (!user) {
            return NextResponse.json({ success: false, message: "User does not exist Sign-Up instead" }, { status: 404 });
        }

        const twilioResponse = await client.verify.v2
            .services(serviceId as string)
            .verificationChecks.create({
                code: otp,
                to: `+${phoneNumber}`,
            });

        if (twilioResponse.status !== "approved") {
            return NextResponse.json({ success: false, message: "OTP verification failed" }, { status: 401 });
        }

        const token = generateToken(user.id);
        const response = NextResponse.json({ success: true, userId: user.id }, { status: 200 });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('Login verify OTP error:', error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
}