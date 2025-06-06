import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { isAdmin } from '@/lib/auth';

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
