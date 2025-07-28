import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { isAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      orders?: {
        some?: object;
        none?: object;
      };
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        email?: { contains: string; mode: 'insensitive' };
        phoneNumber?: { contains: string };
      }>;
    } = {};

    if (status === 'Active') {
      where.orders = { some: {} }; // Has at least one order
    } else if (status === 'Inactive') {
      where.orders = { none: {} }; // No orders
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phoneNumber: { contains: search } },
      ];
    }

    // Fetch customers with aggregated data
    const customers = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        orders: {
          select: {
            id: true,
            totalAmount: true,
            createdAt: true,
          },
        },
        addresses: {
          where: { isDefault: true },
          select: {
            city: true,
            state: true,
          },
        },
      },
    });

    // Transform data to match frontend expectations
    const transformedCustomers = customers.map(customer => {
      const totalOrders = customer.orders.length;
      const totalSpent = customer.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
      const lastOrderDate =
        customer.orders.length > 0
          ? customer.orders.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )[0].createdAt
          : customer.createdAt;

      const defaultAddress = customer.addresses[0];

      return {
        id: customer.id,
        name: customer.name || 'N/A',
        email: customer.email || 'N/A',
        phoneNumber: customer.phoneNumber,
        totalOrders,
        totalSpent,
        lastOrderDate: lastOrderDate.toISOString(),
        status: totalOrders > 0 ? 'Active' : 'Inactive',
        joinDate: customer.createdAt.toISOString(),
        city: defaultAddress?.city || 'N/A',
        state: defaultAddress?.state || 'N/A',
      };
    });

    const totalCustomers = await prisma.user.count({ where });

    return NextResponse.json({
      success: true,
      customers: transformedCustomers,
      pagination: {
        page,
        limit,
        total: totalCustomers,
        pages: Math.ceil(totalCustomers / limit),
      },
    });
  } catch (error) {
    console.error('[GET /api/admin/customers]', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}
