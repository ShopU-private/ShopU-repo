import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { isAdmin } from '@/lib/auth';
import { createCombinationSchema } from '@/lib/schema/adminSchema';

interface Params {
  params: { productsId: string };
}

export async function POST(request: NextRequest, { params }: Params) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();

  const parsed = createCombinationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { price, stock, imageUrl, variantValueIds } = parsed.data;

  if (
    !price ||
    !stock ||
    !imageUrl ||
    !variantValueIds ||
    !Array.isArray(variantValueIds) ||
    variantValueIds.length === 0
  ) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const combination = await prisma.productVariantCombination.create({
    data: {
      price,
      stock,
      imageUrl,
      productId: params.productsId,
      values: {
        create: variantValueIds.map((id: string) => ({
          variantValueId: id,
        })),
      },
    },
    include: {
      values: true,
    },
  });

  return NextResponse.json(combination);
}

export async function GET(_req: Request, { params }: Params) {
  const combinations = await prisma.productVariantCombination.findMany({
    where: { productId: params.productsId },
    include: {
      values: {
        include: {
          variantValue: true,
        },
      },
    },
  });

  return NextResponse.json(combinations);
}
