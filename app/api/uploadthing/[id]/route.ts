// /api/uploadthing/[id]/route.ts
//here [id] is productImage id not product id

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { UTApi } from 'uploadthing/server';

import { isAdmin } from '@/lib/auth';
export const utapi = new UTApi();
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const image = await prisma.productImage.findUnique({
      where: { id: params.id },
    });

    if (!image) return NextResponse.json({ error: 'Image not found' }, { status: 404 });

    const deleted = await utapi.deleteFiles(image.key);

    if (!deleted.success) {
      return NextResponse.json({ error: 'UploadThing deletion failed' }, { status: 500 });
    } //UploadThing image deleted
    await prisma.productImage.delete({ where: { id: params.id } }); //image deleted from prisma

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
