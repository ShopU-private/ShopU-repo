// /api/admin/category

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { isAdmin } from '@/lib/auth';


export async function GET(request: NextRequest) {
    if (!isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }
    try {
        const categories = await prisma.category.findMany();
        return NextResponse.json({categories}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    if (! isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({success : false, error: 'Name is required' }, { status: 400 });
        }

        const newCategory = await prisma.category.create({ data: { name } });
        return NextResponse.json(
            { success: true, data: newCategory },
            { status: 201 }
          );
    } catch {
        return NextResponse.json({ success : false, error: 'Failed to create category' }, { status: 500 });
    }
}




