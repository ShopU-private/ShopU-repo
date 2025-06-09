import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const subCategoryId = searchParams.get('subCategoryId');

    let products;

    if (subCategoryId) {
      products = await prisma.product.findMany({
        where: { subCategoryId },
        include: {
          subCategory: {
            include: {
              category: true,
            },
          },
          variantTypes: {
            include: {
              values: true,
            },
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
    } else if (categoryId) {
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
          variantTypes: {
            include: {
              values: true,
            },
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
    } else {
      products = await prisma.product.findMany({
        include: {
          subCategory: {
            include: {
              category: true,
            },
          },
          variantTypes: {
            include: {
              values: true,
            },
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
