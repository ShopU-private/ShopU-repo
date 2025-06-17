import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Please login first' }, { status: 401 });
    }

    // Verify token and get user details
    const payload = verifyToken(token);
    const userId = payload.id;

    const { items, addressId, paymentMethod } = await req.json();

    if (!items || !items.length || !addressId) {
      return NextResponse.json(
        { success: false, error: 'Items and shipping address are required' },
        { status: 400 }
      );
    }

    // Start a transaction to ensure all operations are atomic
    return await prisma.$transaction(async (tx) => {
      // 1. Verify all products exist and have sufficient stock
      for (const item of items) {
        let product;
        
        if (item.combinationId) {
          // If it's a product variant
          product = await tx.productVariantCombination.findUnique({
            where: { id: item.combinationId },
          });
        } else {
          // If it's a simple product
          product = await tx.product.findUnique({
            where: { id: item.productId },
          });
        }

        if (!product) {
          throw new Error(`Product not found: ${item.productId || item.combinationId}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.id}`);
        }
      }

      // Calculate total amount from items
      const totalAmount = items.reduce(
        (sum: number, item: any) => sum + (parseFloat(item.price) * item.quantity), 
        0
      );

      // 2. Create the order
      // Define interfaces for type safety
      interface OrderItem {
        productId: string;
        combinationId: string | null;
        quantity: number;
        price: number;
        status: string;
      }
      
      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          status: 'PENDING',
          paymentMethod,
          totalAmount,
          orderItems: {
        create: items.map((item: {
          productId: string;
          combinationId?: string;
          quantity: number;
          price: number;
        }) => ({
          productId: item.productId,
          combinationId: item.combinationId || null,
          quantity: item.quantity,
          price: item.price,
          status: 'PENDING',
        } as OrderItem)),
          },
        },
        include: {
          orderItems: true,
        },
      });

      // 3. Update stock for each product
      for (const item of items) {
        if (item.combinationId) {
          // Update variant stock
          await tx.productVariantCombination.update({
            where: { id: item.combinationId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        } else {
          // Update base product stock
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        }
      }

      // 4. Clear the cart items
      await tx.cartItem.deleteMany({
        where: { userId }
      });

      return NextResponse.json({
        success: true, 
        message: 'Order created successfully', 
        orderId: order.id
      }, { status: 201 });
    });
  } catch (error: Error | unknown) {
    console.error('[POST /api/orders]', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
