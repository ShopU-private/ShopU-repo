// /api/admin/products.ts
import { NextResponse ,NextRequest} from "next/server";
import {prisma} from '@/lib/client';
import { isAdmin } from "@/lib/auth";
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  const data = await req.json();
  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      imageUrl: data.imageUrl,
      subCategoryId: data.subCategoryId,
    },
  });
  return NextResponse.json(product);
}
