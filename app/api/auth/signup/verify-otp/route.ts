import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { prisma } from '@/lib/client'
import { generateToken, hashPassword } from '@/lib/auth';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;

if (!accountSid || !authToken || !serviceId) {
    throw new Error('Missing Twilio credentials');
}

const client = twilio(accountSid, authToken);
export async function POST(request: NextRequest) {
    try {
        const { user, otp } = await request.json();
        const { name, email, phoneNumber, password } = user;

        // Check if user already exists - if yes, reject signup
        const existingUser = await prisma.user.findUnique({
            where: { phoneNumber },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'User already exists' },
                { status: 409 } 
            );
        }

        const twilioResponse = await client.verify.v2
            .services(serviceId as string)
            .verificationChecks.create({
                code: otp,
                to: `+${user.phoneNumber}`,
            });

        console.log(twilioResponse.status);

        if (twilioResponse.status !== "approved") {
            return NextResponse.json({ success: false, message: "OTP verification failed" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const userData = {
  name,
  email,
  phoneNumber,
  passwordHash: hashedPassword,
  role: phoneNumber === process.env.PHONE ? 'admin' : 'user',
};

const newUser = await prisma.user.create({ data: userData });

        const token = generateToken(newUser);
        const response = NextResponse.json({ success: true, userId: newUser.id }, { status: 201 });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });
        return response;

    }
    catch (error) {
        console.error('Signup verify OTP error:', error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }

}