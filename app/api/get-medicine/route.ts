// /app/api/medicine/search/route.ts
//only for testing purpose

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Medicine name is required' },
        { status: 400 }
      );
    }

    const medicines = await prisma.medicine.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });

    return NextResponse.json({ success: true, data: medicines });
  } catch (error) {
    console.error('[MEDICINE_SEARCH_ERROR]', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
