import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }

  try {
    const payload = verifyToken(token);

    return NextResponse.json({ loggedIn: true, phoneNumber: payload.phoneNumber }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }
}
