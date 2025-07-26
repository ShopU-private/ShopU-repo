import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit') || '5');
    const category = searchParams.get('category');

    // Query to fetch featured products with higher discount or marked as featured
    const featuredProducts = await prisma.product.findMany({
      where: {
        // Only include products with images for better display
        imageUrl: {
          not: null,
          not: '',
        },
        // Optional category filter
        ...(category && {
          subCategory: {
            category: {
              name: {
                contains: category,
                mode: 'insensitive',
              },
            },
          },
        }),
      },
      include: {
        subCategory: {
          include: {
            category: true,
          },
        },
      },
      orderBy: [
        // Order by stock and price to get a good mix
        { stock: 'desc' },
        { price: 'asc' },
      ],
      take: limit,
    });

    // Add calculated discount field
    const productsWithDiscount = featuredProducts.map(product => {
      // Calculate a random discount between 10-50% for products without one
      const discount = Math.floor(Math.random() * 40) + 10;
      const originalPrice = Math.ceil(product.price * (100 / (100 - discount)));

      return {
        ...product,
        discount,
        originalPrice,
        featured: true,
      };
    });

    return NextResponse.json({
      success: true,
      products: productsWithDiscount,
    });
  } catch (err) {
    console.error('[GET /api/products/featured]', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch featured products' },
      { status: 500 }
    );
  }
}
