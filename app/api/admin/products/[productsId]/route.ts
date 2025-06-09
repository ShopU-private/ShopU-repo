import { NextResponse } from 'next/server';
import { prisma } from '@/lib/client';

interface Params {
  params: { productId: string };
}

export async function GET(_req: Request, { params }: Params) {
  const product = await prisma.product.findUnique({
    where: { id: params.productId },
    include: {
      variantTypes: {
        include: {
          values: true,
        },
      },
      combinations: {
        include: {
          values: {
            include: {
              variantValue: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  return NextResponse.json(product);
}
