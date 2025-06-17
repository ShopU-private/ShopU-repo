import { prisma } from '@/lib/client';
import { NextRequest, NextResponse } from 'next/server';

import { Product } from '@prisma/client';

// In-memory cache with expiration
const searchCache = new Map<string, { data: Product[]; timestamp: number }>();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes cache TTL

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query')?.toLowerCase() || '';
  const limit = Number(searchParams.get('limit') || '20');
  const page = Number(searchParams.get('page') || '1');
  const offset = (page - 1) * limit;

  if (!query) {
    return NextResponse.json({ products: [] });
  }

  // Create a cache key from the query parameters
  const cacheKey = `${query.trim()}_${limit}_${page}`;

  // Check if we have a cached result
  if (searchCache.has(cacheKey)) {
    const cachedResult = searchCache.get(cacheKey);
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
      return NextResponse.json({
        products: cachedResult.data,
        cached: true,
        page,
        limit,
      });
    }
  }

  // Split the query into keywords for more efficient searching
  const keywords = query.split(' ').filter(Boolean);

  try {
    // Optimize the query structure
    const products = await prisma.product.findMany({
      where: {
        OR: [
          // Exact match (higher priority)
          { name: { equals: query, mode: 'insensitive' } },
          // Contains all keywords
          {
            AND: keywords.map(word => ({
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
        ],
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
      take: limit,
      skip: offset,
      orderBy: {
        // Order by most relevant results first
        name: 'asc',
      },
    });

    // Store in cache
    searchCache.set(cacheKey, {
      data: products,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      products,
      page,
      limit,
      total: products.length,
    });
  } catch (error) {
    console.error('[SEARCH PRODUCTS]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search products' },
      { status: 500 }
    );
  }
}
