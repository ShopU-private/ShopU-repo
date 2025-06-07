import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const subCategoryId = searchParams.get('subCategoryId');

    let products;

    if (subCategoryId) {
      // Filter by subCategoryId if available
      products = await prisma.product.findMany({
        where: { subCategoryId },
        include: {
          subCategory: {
            include: {
              category: true,
            },
          },
          variants: true,
        },
      });
    } else if (categoryId) {
      // Filter by categoryId → find all subCategories first
      products = await prisma.product.findMany({
        where: {
          subCategory: {
            categoryId,
          },
        },
        include: {
          subCategory: {
            include: {
              category: true,
            },
          },
          variants: true,
        },
      });
    } else {
      // No filter → return all products
      products = await prisma.product.findMany({
        include: {
          subCategory: {
            include: {
              category: true,
            },
          },
          variants: true,
        },
      });
    }

    return NextResponse.json({ products });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
