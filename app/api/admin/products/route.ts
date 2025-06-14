// /api/admin/products.ts
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/client';
import { isAdmin } from '@/lib/auth';
import { createProductSchema } from '@/lib/schema/adminSchema';
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();

  const parsed = createProductSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const { name, description, price, stock, imageUrl, subCategoryId } = parsed.data;
  const product = await prisma.product.create({
    data: {
      name: name,
      description: description,
      price: price,
      stock: stock,
      imageUrl: imageUrl,
      subCategoryId: subCategoryId,
    },
  });
  return NextResponse.json(product);
}

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      variantTypes: true,
      combinations: true,
    },
  });
  return NextResponse.json(products);
}
