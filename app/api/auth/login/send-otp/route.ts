import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// validate environment variables

const hasRequiredEnvVars = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_SERVICE_ID;

const client = hasRequiredEnvVars ? twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!) : null;

export async function POST(request: NextRequest) {
  try {

    // check env vars first
    if (!hasRequiredEnvVars || !client) {
      return NextResponse.json(
        { success: false, message: 'Service temporarily unavailable' },
        { status: 503 }
      )
    }

    const { phoneNumber } = await request.json();
    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Phone number is required' },
        { status: 400 }
      );
    }

    // validate phone number format(10 digits)
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    const twilioResponse = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_ID!)
      .verifications.create({
        to: `+91${cleanedPhone}`,
        channel: 'sms',
      });

    if (twilioResponse && ['pending', 'sent'].includes(twilioResponse.status)) {
      return NextResponse.json(
        { success: true, message: 'OTP sent successfully' },
        { status: 201 }
      );
    } else {
      return NextResponse.json({ success: false, message: 'OTP sending failed' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: `Internal Error: ${String(error)}` }, { status: 500 });
  }
}
