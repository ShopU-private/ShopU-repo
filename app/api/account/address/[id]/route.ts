import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { verifyToken } from '@/lib/auth';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { id } = params;

    const address = await prisma.userAddress.findUnique({
      where: { id },
    });

    if (!address || address.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ address });
  } catch (error) {
    console.error('API ERROR at GET /api/account/address/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

//Update address
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    // Verify the address belongs to the user before updating
    const existingAddress = await prisma.userAddress.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const updatedAddress = await prisma.userAddress.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ address: updatedAddress });
  } catch (error) {
    console.error('API ERROR at PATCH /api/account/address/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

//Delete address
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { id } = await params;

    // Verify the address belongs to the user before deleting
    const existingAddress = await prisma.userAddress.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.userAddress.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Address deleted' });
  } catch (error) {
    console.error('API ERROR at DELETE /api/account/address/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
