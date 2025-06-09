import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { isAdmin } from '@/lib/auth';
import { createVariantTypeSchema } from '@/lib/adminSchema';

interface Params {
  params: { productsId: string };
}

export async function POST(request: NextRequest, { params }: Params) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();

  const parsed = createVariantTypeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { name } = parsed.data;

  if (!name) {
    return NextResponse.json({ error: 'Name required' }, { status: 400 });
  }

  const variantType = await prisma.variantType.create({
    data: {
      name,
      productId: params.productsId,
    },
  });

  return NextResponse.json(variantType);
}
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productsId');

    let variantTypes;
    if (productId) {
      variantTypes = await prisma.variantType.findMany({
        where: { productId },
        include: { values: true }, // include variant values if needed
      });
    } else {
      variantTypes = await prisma.variantType.findMany({
        include: { values: true },
      });
    }

    return NextResponse.json(variantTypes, { status: 200 });
  } catch (error) {
    let message = 'Unknown error';

    if (error instanceof Error) {
      message = error.message;
    }

    return NextResponse.json(
      { error: 'Failed to fetch variant types', details: message },
      { status: 500 }
    );
  }
}
