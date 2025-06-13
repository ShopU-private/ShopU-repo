import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { isAdmin } from '@/lib/auth';
import { createCombinationSchema } from '@/lib/schema/adminSchema';

interface Params {
  params: { productsId: string; combinationId?: string };
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { productsId: string; combinationId: string } }
) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { combinationId } = params;

    await prisma.productVariantCombination.delete({
      where: {
        id: combinationId,
      },
    });

    return NextResponse.json({ message: 'Combination deleted successfully' });
  } catch (err) {
    console.error('DELETE error:', err);
    return NextResponse.json({ error: 'Failed to delete combination' }, { status: 500 });
  }
}
