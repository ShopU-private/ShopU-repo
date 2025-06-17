import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';
import { verifyToken } from '@/lib/auth';

// GET - fetch all cart items for the logged in user
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Please login first' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const userId = payload.id;

    // Optimize the query by selecting only needed fields
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            variantTypes: {
              include: {
                values: true,
              },
            },
            combinations: {
              include: {
                values: {
                  include: {
                    variantValue: true,
                  },
                },
              },
            },
          },
        },
        medicine: {
          select: {
            id: true,
            name: true, 
            price: true,
            manufacturerName: true,
            packSizeLabel: true
          }
        },
      },
      orderBy: { addedAt: 'desc' },
    });

    return NextResponse.json({ success: true, cartItems });
  } catch (error) {
    console.error('[GET /api/cart]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart items' },
      { status: 500 }
    );
  }
}

// POST - add a new item to the cart
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Please login first' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const userId = payload.id;
    
    const { productId, medicineId, quantity = 1 } = await req.json();

    if (!productId && !medicineId) {
      return NextResponse.json(
        { success: false, error: 'Product ID or Medicine ID is required' },
        { status: 400 }
      );
    }

    if (productId && medicineId) {
      return NextResponse.json(
        { success: false, error: 'Cannot specify both product ID and medicine ID' },
        { status: 400 }
      );
    }

    // Handle medicine items
    if (medicineId) {
      // Transaction for better performance and atomicity
      const result = await prisma.$transaction(async (prisma) => {
        // Check if the medicine exists
        const medicine = await prisma.medicine.findUnique({
          where: { id: medicineId },
          select: { id: true }
        });

        if (!medicine) {
          throw new Error('Medicine not found');
        }

        // Check if medicine is already in cart
        const existingCartItem = await prisma.cartItem.findFirst({
          where: {
            userId,
            medicineId,
          },
        });

        let cartItem;
        if (existingCartItem) {
          cartItem = await prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity: existingCartItem.quantity + quantity },
            include: { 
              medicine: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  manufacturerName: true,
                  packSizeLabel: true
                }
              } 
            },
          });
        } else {
          cartItem = await prisma.cartItem.create({
            data: {
              userId,
              medicineId,
              quantity,
            },
            include: { 
              medicine: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  manufacturerName: true,
                  packSizeLabel: true
                }
              } 
            },
          });
        }
        return cartItem;
      });

      return NextResponse.json(
        { success: true, message: 'Medicine added to cart', cartItem: result },
        { status: 201 }
      );
    }

    // Handle product items
    if (productId) {
      // Transaction for better performance and atomicity
      const result = await prisma.$transaction(async (prisma) => {
        // Check if the product exists
        const product = await prisma.product.findUnique({
          where: { id: productId },
          select: { id: true }
        });

        if (!product) {
          throw new Error('Product not found');
        }

        // Check if product is already in cart
        const existingCartItem = await prisma.cartItem.findFirst({
          where: {
            userId,
            productId,
          },
        });

        let cartItem;
        if (existingCartItem) {
          cartItem = await prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity: existingCartItem.quantity + quantity },
            include: { 
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  imageUrl: true
                }
              } 
            },
          });
        } else {
          cartItem = await prisma.cartItem.create({
            data: {
              userId,
              productId,
              quantity,
            },
            include: { 
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  imageUrl: true
                }
              } 
            },
          });
        }
        return cartItem;
      });

      return NextResponse.json(
        { success: true, message: 'Item added to cart', cartItem: result },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('[POST /api/cart]', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: error instanceof Error && error.message.includes('not found') ? 404 : 500 }
    );
  }
}
