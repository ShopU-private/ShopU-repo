'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/app/hooks/useCart';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import PaymentMethodModal from '../components/PaymentMethodModal';

export default function CheckoutPage() {
  const { cartItems, isLoading } = useCart();
  const [subtotal, setSubtotal] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  useEffect(() => {
    // Calculate subtotal whenever cart items change
    const total = cartItems.reduce((sum, item) => {
      const itemPrice = item.product?.price || item.medicine?.price || 0;
      return sum + (itemPrice * item.quantity);
    }, 0);
    setSubtotal(total);
  }, [cartItems]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] px-4 py-8">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="mb-2 text-2xl font-medium text-gray-700">Your cart is empty</h2>
            <p className="mb-6 text-center text-gray-500">
              You need to add items to your cart before checkout.
            </p>
            <Link
              href="/"
              className="rounded-lg bg-teal-600 px-6 py-3 text-white transition-all hover:bg-teal-700"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Checkout</h1>
        
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Your Order Summary</h2>
          <div className="space-y-1 mb-6">
            <div className="flex justify-between text-sm">
              <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{subtotal > 500 ? 'Free' : '₹40.00'}</span>
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-medium">
              <span>Total</span>
              <span>₹{(subtotal + (subtotal > 500 ? 0 : 40)).toFixed(2)}</span>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              Please review your order details before proceeding to payment.
            </p>
          </div>
          
          <div className="flex justify-between">
            <Link
              href="/"
              className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-100"
            >
              Continue Shopping
            </Link>
            <button
              className="rounded-lg bg-teal-600 px-6 py-2 text-white hover:bg-teal-700"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
      
      {/* Payment Method Modal */}
      <PaymentMethodModal 
        isOpen={isPaymentModalOpen}
        onCloseAction={() => setIsPaymentModalOpen(false)} // Using onCloseAction instead of onClose
        amount={subtotal + (subtotal > 500 ? 0 : 40)}
        orderId={orderId}
      />
    </div>
  );
}
