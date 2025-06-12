import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { isAdmin } from '@/lib/auth';

interface Params {
  params: { productsId: string };
}

export async function GET(_req: Request, { params }: Params) {
  const product = await prisma.product.findUnique({
    where: { id: params.productsId },
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

export async function DELETE(req: NextRequest, { params }: Params) {
  // if (!isAdmin(req)) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    await prisma.product.delete({
      where: { id: params.productsId },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('[DELETE /api/admin/products/[productsId]]', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
