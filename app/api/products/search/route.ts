import { prisma } from '@/lib/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query')?.toLowerCase() || '';

  if (!query) {
    return NextResponse.json({ products: [] });
  }

  // Split the query into keywords like "men clothing" -> ["men", "clothing"]
  const keywords = query.split(' ').filter(Boolean);

  try {
    const products = await prisma.product.findMany({
      where: {
        AND: keywords.map((word) => ({
          OR: [
            { name: { contains: word, mode: 'insensitive' } },
            {
              subCategory: {
                name: { contains: word, mode: 'insensitive' },
              },
            },
            {
              subCategory: {
                category: {
                  name: { contains: word, mode: 'insensitive' },
                },
              },
            },
          ],
        })),
      },
      include: {
        subCategory: {
          include: { category: true },
        },
        combinations: {
          include: {
            values: {
              include: {
                variantValue: {
                  include: {
                    variantType: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('[SEARCH PRODUCTS]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
