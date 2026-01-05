import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { connectToRedis } from '@/redis/redisClient';
import { cache } from '@/redis/helper';

interface ProductResponse {
  success: boolean;
  products: any[];
  total: number;
  currentPage: number;
  totalPages: number;
  fromCache: boolean;
}

export async function GET(req: NextRequest) {
  try {
    await connectToRedis();

    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, Number(searchParams.get('limit') || '20'));
    const page = Math.max(1, Number(searchParams.get('page') || '1'));
    const category = searchParams.get('category');

    const skip = (page - 1) * limit;
    const cacheKey = `featured_products_${category || 'all'}_page_${page}_limit_${limit}`;

    // Check cache first
    console.log("checking cache", cacheKey);
    
    const cached = await cache.get<ProductResponse>(cacheKey);

    if (cached) {
      console.log("cache hit");
      
      return NextResponse.json({
        ...cached,
        fromCache: true,
      });
    }else{
      console.log("cache miss");
      
    }

    const whereClause = {
      imageUrl: { not: '' },
      ...(category && {
        subCategory: {
          category: {
            name: {
              contains: category,
              mode: 'insensitive' as const,
            },
          },
        },
      }),
    };

    const [totalCount, products] = await Promise.all([
      prisma.product.count({ where: whereClause }),
      prisma.product.findMany({
        where: whereClause,
        include: {
          subCategory: {
            include: {
              category: true,
            },
          },
        },
        orderBy: [{ stock: 'desc' }, { price: 'asc' }],
        skip,
        take: limit,
      }),
    ]);

    const productsWithDiscount = products.map((product) => {
      
      const discount = ((Number(product.id) % 30) + 10); 
      const originalPrice = Math.ceil(
        Number(product.price) * (100 / (100 - discount))
      );
      
      return {
        ...product,
        discount,
        originalPrice,
        featured: true,
      };
    });

    const responseData: ProductResponse = {
      success: true,
      products: productsWithDiscount,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      fromCache: false,
    };

    // Store in cache for 5 minutes
    console.log("Saving data into cache...");
    cache.set(cacheKey, responseData, 60 * 5).catch(console.error);

    return NextResponse.json(responseData);
    
  } catch (err) {
    console.error('[GET /api/products]', err);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}