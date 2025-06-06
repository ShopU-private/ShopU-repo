import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILIO_SERVICE_ID;

if (!accountSid || !authToken || !serviceId) {
  throw new Error('Missing Twilio credentials');
}

const client = twilio(accountSid, authToken);
export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    const twilioResponse = await client.verify.v2
      .services(serviceId as string)
      .verifications.create({
        to: `+91${phoneNumber}`,
        channel: 'sms',
      });

    if (twilioResponse.status === 'pending') {
      return NextResponse.json({ sent: true }, { status: 200 });
    } else {
      return NextResponse.json({ sent: false }, { status: 500 });
    }
  } catch (error) {
    console.error('Login send OTP error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
