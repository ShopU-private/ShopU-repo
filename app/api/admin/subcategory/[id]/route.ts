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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;

  try {
    await prisma.subCategory.delete({ where: { id } });
    return NextResponse.json({ message: 'Subcategory deleted' });
  } catch {
    return NextResponse.json({ error: 'Failed to delete subcategory' }, { status: 500 });
  }
}
