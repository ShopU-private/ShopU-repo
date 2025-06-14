import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { updateVariantTypeSchema } from '@/lib/schema/adminSchema';
import { isAdmin } from '@/lib/auth';

interface Params {
  params: { productId: string; variantTypeId: string };
}

export async function PUT(req: NextRequest, { params }: Params) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = updateVariantTypeSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const updated = await prisma.variantType.update({
      where: { id: params.variantTypeId },
      data: {
        name: parsed.data.name,
      },
    });

    return NextResponse.json({ success: true, variantType: updated });
  } catch (error) {
    console.error('[PUT /variant-types/:variantTypeId]', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!isAdmin(_req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.variantType.delete({
      where: { id: params.variantTypeId },
    });

    return NextResponse.json({ success: true, message: 'Variant type deleted' });
  } catch (error) {
    console.error('[DELETE /variant-types/:variantTypeId]', error);
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
}
