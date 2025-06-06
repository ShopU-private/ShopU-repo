// /api/admin/subcategory/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { isAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get('categoryId');

  try {
    const subCategories = await prisma.subCategory.findMany({
      where: categoryId ? { categoryId } : undefined, //fetches category under category id if avl else all subCategories
      include: { category: true },
    });

    return NextResponse.json(subCategories, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { name, categoryId } = await req.json();

    if (!name || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'name and categoryId are required' },
        { status: 400 }
      );
    }

    const newSubCategory = await prisma.subCategory.create({
      data: { name, categoryId },
    });

    return NextResponse.json({ success: true, newSubCategory }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: 'Failed to create subcategory' },
      { status: 500 }
    );
  }
}
