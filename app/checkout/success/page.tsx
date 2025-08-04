'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowLeft, Loader } from 'lucide-react';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const paymentMethod = searchParams.get('method');
  const paymentId = searchParams.get('paymentId');
  const orderId = searchParams.get('orderId');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If this was a real implementation, we would check the payment status here
    async function verifyPayment() {
      if (orderId && paymentId) {
        setIsLoading(true);
        try {
          // Verify payment with backend
          const response = await fetch(`/api/payment?orderId=${orderId}`);
          // Handle response
          const data = await response.json();
          console.log('Payment verification:', data);
        } catch (error) {
          console.error('Error verifying payment:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }

    verifyPayment();
  }, [orderId, paymentId]);

  return (
    <div className="min-h-[70vh] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="mb-4 h-12 w-12 animate-spin text-teal-600" />
            <h2 className="text-xl font-semibold text-gray-700">Verifying your payment...</h2>
            <p className="mt-2 text-gray-500">Please wait while we confirm your order.</p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex flex-col items-center justify-center py-6">
              <div className="mb-6 text-teal-500">
                <CheckCircle2 className="h-16 w-16" />
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-800">Order Placed Successfully!</h1>
              <p className="mb-6 text-center text-gray-600">
                {paymentMethod === 'cod'
                  ? 'Your order has been placed. We will deliver it to your doorstep soon!'
                  : 'Your payment was successful and your order has been placed.'}
              </p>

              {orderId && (
                <div className="mb-6 w-full rounded-lg bg-gray-50 p-4 text-center">
                  <p className="text-sm text-gray-500">Order Reference</p>
                  <p className="font-mono font-medium text-gray-800">{orderId}</p>
                </div>
              )}

              <Link
                href="/"
                className="bg-background1 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-white transition-all hover:scale-102"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
