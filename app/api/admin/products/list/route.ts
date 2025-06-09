import { NextResponse } from 'next/server';
import { prisma } from '@/lib/client';

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      variantTypes: true,
      combinations: true,
    },
  });
  return NextResponse.json(products);
}
