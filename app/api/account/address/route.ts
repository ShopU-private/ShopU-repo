import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
      const token = req.cookies.get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = verifyToken(token);
  if (!user){
  return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  } 

  const address = await prisma.userAddress.findMany({
    where: { userId: user.id },
  });

  return NextResponse.json({ address });
  } catch (error) {
    console.error("API ERROR at GET /api/account/address:", error);
    return NextResponse.json(
      {error: "Function not implemented or internal error"},
      {status: 500}
    )
  }
}

export async function POST(req: NextRequest) {
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

  return NextResponse.json({ address: newAddress });
}