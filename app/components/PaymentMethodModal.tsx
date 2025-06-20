'use client';

import { useState } from 'react';
import { X, Loader } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onCloseAction: () => void; // Changed from onClose to onCloseAction
  amount: number;
  orderId?: string;
}

export default function PaymentMethodModal({ isOpen, onCloseAction, amount, orderId }: PaymentMethodModalProps) {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string>('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;
  const handlePaymentSelection = async () => {
    setIsProcessing(true);
    
    try {
      // Dispatch a custom event to close the cart modal
      const closeCartEvent = new CustomEvent('closeCartModal');
      window.dispatchEvent(closeCartEvent);
      
      // If Cash on Delivery, simply redirect to order confirmation
      if (selectedMethod === 'cod') {
        router.push('/checkout/success?method=cod');
        onCloseAction(); // Close the payment modal
        return;
      }
      
      // For online payment methods, use cashfree
      const response = await fetch('/api/payment/cashfree', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId || `order_${Date.now()}`,
          amount: amount,
          currency: 'INR'
        }),
      });

      const data = await response.json();
      
      if (data.success && data.paymentUrl) {
        // First close the payment modal
        onCloseAction();
        // Then redirect to the payment URL
        window.location.href = data.paymentUrl;
      } else {
        console.error('Failed to initiate payment:', data.error);
        alert('Payment initiation failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      alert('Payment processing error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="animate-slideUp relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="relative p-4 border-b border-gray-200">
          <button
            onClick={onCloseAction} // Changed from onClose to onCloseAction
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-medium text-gray-800">Payment Method</h2>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-gray-600 mb-2">How would you like to pay?</p>
          
          {/* Payment Methods */}
          <div className="space-y-3">
            {/* Credit/Debit Card */}
            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="payment-method"
                  value="card"
                  checked={selectedMethod === 'card'}
                  onChange={() => setSelectedMethod('card')}
                  className="h-4 w-4 text-teal-600"
                />
                <span className="ml-3 text-gray-700">Credit Or Debit</span>
              </div>
              <div className="flex items-center space-x-1">
                <Image src="/visa.png" alt="Visa" width={32} height={20} className="h-5 object-contain" />
                <Image src="/mastercard.png" alt="Mastercard" width={32} height={20} className="h-5 object-contain" />
                <Image src="/maestro.png" alt="Maestro" width={32} height={20} className="h-5 object-contain" />
                <Image src="/amex.png" alt="American Express" width={32} height={20} className="h-5 object-contain" />
              </div>
            </label>

            {/* PayPal */}
            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="payment-method"
                  value="paypal"
                  checked={selectedMethod === 'paypal'}
                  onChange={() => setSelectedMethod('paypal')}
                  className="h-4 w-4 text-teal-600"
                />
                <span className="ml-3 text-gray-700">Paypal</span>
              </div>
              <div>
                <Image src="/paypal.png" alt="PayPal" width={70} height={20} className="h-6 object-contain" />
              </div>
            </label>

            {/* UPI */}
            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="payment-method"
                  value="upi"
                  checked={selectedMethod === 'upi'}
                  onChange={() => setSelectedMethod('upi')}
                  className="h-4 w-4 text-teal-600"
                />
                <span className="ml-3 text-gray-700">UPI</span>
              </div>
              <div>
                <Image src="/upi.png" alt="UPI" width={70} height={20} className="h-6 object-contain" />
              </div>
            </label>

            {/* Cash on Delivery */}
            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex items-center">
                <input
                  type="radio"
                  name="payment-method"
                  value="cod"
                  checked={selectedMethod === 'cod'}
                  onChange={() => setSelectedMethod('cod')}
                  className="h-4 w-4 text-teal-600"
                />
                <span className="ml-3 text-gray-700">Cash On Delivery</span>
              </div>
            </label>
          </div>
        </div>

        {/* Footer - Confirm Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handlePaymentSelection}
            disabled={isProcessing}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <Loader className="animate-spin mr-2 h-4 w-4" />
                Processing...
              </>
            ) : (
              'Place Order'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
