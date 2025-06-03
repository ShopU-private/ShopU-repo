import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { prisma } from "@/lib/client";


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;

if (!accountSid || !authToken || !serviceId) {
    throw new Error('Missing Twilio credentials');
}

const client = twilio(accountSid, authToken);

export async function POST(request: NextRequest) {
    try {
        const { user } = await request.json();
        const { phoneNumber } = user || {};

        if (!phoneNumber) {
            return NextResponse.json(
                { success: false, message: "Phone number is required" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { phoneNumber },
        });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: "User already exists" },
                { status: 409 }
            );
        }

        const twilioResponse = await client.verify.v2
            .services(serviceId as string)
            .verifications.create({
                to: `+${phoneNumber}`,
                channel: "sms"
            });

        if (twilioResponse.status === "pending") {
            return NextResponse.json({
                sent: true,
            }, { status: 200 });
        } else {
            return NextResponse.json({
                sent: false,
            }, { status: 500 });
        }

    }
    catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
}