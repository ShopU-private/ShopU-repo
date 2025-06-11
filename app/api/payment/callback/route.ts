import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/client';

// POST - handle payment callback from provider
export async function POST(req: NextRequest) {
  try {
    // Get callback data from payment provider
    const {
      orderId,
      providerPaymentId,
      status,
      provider = 'CASHFREE',
      metadata = {}
    } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'Order ID and status are required' },
        { status: 400 }
      );
    }

    // Find the payment
    const payment = await prisma.payment.findFirst({
      where: { 
        orderId,
        provider
      },
      include: {
        order: true
      }
    });

    if (!payment) {
      return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 404 });
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status,
        providerPaymentId,
        metadata: {
          ...payment.metadata || {},
          ...metadata,
          completedAt: new Date().toISOString()
        }
      }
    });

    // If payment is successful, update order status
    if (status === 'COMPLETED' || status === 'SUCCESS') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'paid' }
      });
    } else if (status === 'FAILED') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'payment_failed' }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Payment status updated',
      payment: updatedPayment
    });
  } catch (error) {
    console.error('[POST /api/payment/callback]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process payment callback' },
      { status: 500 }
    );
  }
}
