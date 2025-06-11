import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/client';

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
    
    // Get order details from request body
    const { orderId, amount, currency = "INR" } = await req.json();
    
    if (!orderId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Order ID and amount are required' },
        { status: 400 }
      );
    }

    // Verify the order exists and belongs to the user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId
      }
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // In a real implementation, you would create a payment order with Cashfree API
    // But since we're using a hosted URL directly, we'll just return that URL
    
    // Get the Cashfree base URL from environment variables
    const cashfreeBaseUrl = process.env.CASHFREE_BASE_URL;
    
    if (!cashfreeBaseUrl) {
      console.error('CASHFREE_BASE_URL environment variable is not set');
      return NextResponse.json(
        { success: false, error: 'Payment service configuration error' },
        { status: 500 }
      );
    }
    
    // Build the hosted URL with query parameters
    const cashfreeHostedUrl = `${cashfreeBaseUrl}?orderId=${orderId}&amount=${amount}&userId=${userId}`;

    // Create a payment record in the database
    const payment = await prisma.payment.create({
      data: {
        orderId,
        userId,
        amount: parseFloat(amount),
        currency,
        provider: 'CASHFREE',
        status: 'PENDING',
        metadata: {
          initiatedBy: userId,
          initiatedAt: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({
      success: true,
      paymentUrl: cashfreeHostedUrl,
      orderId: orderId,
      paymentId: payment.id
    });
  } catch (error) {
    console.error('[POST /api/payment/cashfree]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
