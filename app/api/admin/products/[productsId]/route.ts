import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { isAdmin } from '@/lib/auth';
import { UTApi } from 'uploadthing/server';
import { updateProductSchema } from '@/lib/schema/adminSchema';
export const utapi = new UTApi();
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
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const productId = params.productsId;

    // 1. Find all images for this product
    const images = await prisma.productImage.findMany({
      where: { productId },
    });

    // 2. Delete all files from UploadThing
    const keysToDelete = images.map(img => img.key);
    if (keysToDelete.length > 0) {
      const result = await utapi.deleteFiles(keysToDelete);
      if (!result.success) {
        return NextResponse.json(
          { error: 'Failed to delete image(s) from UploadThing' },
          { status: 500 }
        );
      }
    }

    // 3. Delete product (and Prisma will cascade delete productImages)
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('[DELETE /api/admin/products/[productsId]]', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = updateProductSchema.safeParse(await req.json());

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: params.productsId },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('[PUT /api/admin/products/:productId]', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}