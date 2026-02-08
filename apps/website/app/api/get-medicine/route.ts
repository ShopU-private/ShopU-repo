// /app/api/medicine/search/route.ts
//only for testing purpose

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@shopu/prisma/prismaClient';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');
    const type = searchParams.get('type');
    const limit = Number(searchParams.get('limit') || '30');
    const page = Number(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    // If neither name nor type is provided, return all medicines with limit
    if (!name && !type) {
      const medicines = await prisma.medicine.findMany({
        take: limit,
        skip: offset,
        orderBy: { name: 'asc' },
      });

      return NextResponse.json({ success: true, data: medicines });
    }

    // Handle searching by name
    if (name && name.trim() !== '') {
      const searchTerms = name
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(term => term.length > 1);

      const medicines = await prisma.medicine.findMany({
        where: {
          OR: [
            // Exact match (fast)
            { name: { equals: name, mode: 'insensitive' } },
            // Starts with match (fast)
            { name: { startsWith: name, mode: 'insensitive' } },
            // Contains match for individual terms (slower but comprehensive)
            ...searchTerms.map(term => ({
              name: { contains: term, mode: 'insensitive' as const },
            })),
          ],
        },
        take: limit,
        skip: offset,
        orderBy: [
          // Order by name ascending
          {
            name: 'asc',
          },
        ],
      });

      // Store in cache

      return NextResponse.json({ success: true, data: medicines });
    }

    // Handle filtering by type
    if (type) {
      const medicines = await prisma.medicine.findMany({
        where: {
          type: { contains: type, mode: 'insensitive' },
        },
        take: limit,
        skip: offset,
        orderBy: { name: 'asc' },
      });

      return NextResponse.json({ success: true, data: medicines });
    }

    // Default response
    return NextResponse.json({ success: true, data: [] });
  } catch (error) {
    console.error('[MEDICINE_SEARCH_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
