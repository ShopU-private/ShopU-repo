'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useCart } from '@/app/hooks/useCart';
import { Loader, ChevronUp, X, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLocation } from '../context/LocationContext';
import dynamic from 'next/dynamic';
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  storeId?: string;
  storeName?: string;
}

interface CartModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

// Lazy-load the CartItemList component
const CartItemList = dynamic(() => import('./cart/CartItemList'), {
  loading: () => (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader className="h-8 w-8 animate-spin text-teal-600" />
        <p className="text-gray-500 text-sm">Loading your cart...</p>
      </div>
    </div>
  )
});

export default function CartModal({ isOpen, onCloseAction }: CartModalProps) {
  const { cartItems, isLoading, refreshCart, totals } = useCart();
  const [processingAction, setProcessingAction] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { location } = useLocation();
  
  const deliveryAddress = useMemo(() => 
    location ? `${location.address}, PIN: ${location.pincode}` : "Please set delivery location"
  , [location]);

  // Memoized item total to avoid recalculation
  const itemTotal = useMemo(() => totals?.subtotal || 0, [totals]);
  
  // Refresh cart data when modal is opened, using a ref to avoid unnecessary refreshes
  useEffect(() => {
    let mounted = true;
    
    if (isOpen) {
      // Use a slight delay to prioritize UI rendering first
      const timer = setTimeout(() => {
        if (mounted) refreshCart();
      }, 100);
      return () => {
        clearTimeout(timer);
        mounted = false;
      };
    }
  }, [isOpen, refreshCart]);
  
  useEffect(() => {
    const handleCloseCartModal = () => {
      onCloseAction();
    };
    
    window.addEventListener('closeCartModal', handleCloseCartModal);
    
    return () => {
      window.removeEventListener('closeCartModal', handleCloseCartModal);
    };
  }, [onCloseAction]);

  const handleProceedToCheckout = useCallback((e: React.MouseEvent) => {
    // Stop event propagation to prevent modal closing
    e.preventDefault();
    e.stopPropagation();
    
    // Close the cart modal
    onCloseAction();
    // Navigate to checkout page
    router.push('/checkout');
  }, [onCloseAction, router]);
  
  if (!isOpen) return null;

  const renderCartContent = () => {
    if (isLoading && cartItems.length === 0) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader className="h-8 w-8 animate-spin text-teal-600" />
            <p className="text-gray-500 text-sm">Loading your cart...</p>
          </div>
        </div>
      );
    }
    
    if (cartItems.length === 0) {
      return (
        <div className="min-h-[50vh] px-4 sm:px-6 py-8">
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <div className="mb-6 rounded-full bg-teal-50 p-6 sm:p-8">
              <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-teal-400" />
            </div>
            <h2 className="mb-2 text-xl sm:text-2xl font-semibold text-gray-800">Your cart is empty</h2>
            <p className="mb-6 text-center text-gray-500 text-sm sm:text-base px-4">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <button
              onClick={onCloseAction}
              className="rounded-xl bg-teal-600 px-6 py-3 text-white font-medium transition-all hover:bg-teal-700 active:scale-95"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-0">
        <CartItemList 
          cartItems={cartItems} 
          processingAction={processingAction}
          setProcessingAction={setProcessingAction}
        />

        {/* Bill Details */}
        <div className="bg-white border-t border-gray-200">
          <div className="bg-teal-50 px-4 py-3 border-b border-teal-100">
            <h2 className="text-base font-semibold text-teal-800">Bill Details</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Item Total:</span>
              <span className="font-medium">₹{itemTotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping:</span>
              <span className="text-teal-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-100">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg text-teal-600">₹{itemTotal.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-white border-t border-gray-200">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-800">Cancellation Policy</h2>
          </div>
          <div className="p-4 text-xs sm:text-sm text-gray-600 space-y-2">
            <p>Orders cannot be cancelled once packed for delivery.</p>
            <p>In case of unexpected delays, a refund will be provided, if applicable.</p>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white border-t border-gray-200">
          <div className="p-4 flex justify-between items-start gap-3">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-teal-500 flex-shrink-0 mt-1"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Delivery Address</p>
                <p className="text-xs text-gray-600">{deliveryAddress}</p>
              </div>
            </div>
            <button
              onClick={() => {
                onCloseAction();
                router.push('/');
              }}
              className="text-teal-600 hover:text-teal-700 px-3 py-1 text-sm font-medium rounded-lg hover:bg-teal-50 transition-colors flex-shrink-0"
            >
              Change
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-start justify-end bg-black/40 backdrop-blur-sm">
      <div className="animate-slideRight relative w-full max-w-sm sm:max-w-md lg:max-w-lg h-screen max-h-screen overflow-hidden transform bg-white shadow-2xl transition-all rounded-r-2xl sm:rounded-r-3xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-teal-500 to-teal-600 px-4 sm:px-6 py-4 sm:py-5">
          <button
            onClick={onCloseAction}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Your Cart</h1>
              <p className="text-teal-100 text-sm">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100vh-80px)]">
          <div className="flex-1 overflow-y-auto">
            {renderCartContent()}
          </div>

          {/* Footer - Checkout Button */}
          {cartItems.length > 0 && (
            <div className="bg-white border-t border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-center sm:text-left">
                  <p className="text-lg sm:text-xl font-bold text-gray-800">₹{itemTotal.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">Inclusive of all taxes</p>
                </div>
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Proceed to Checkout
                  <ChevronUp className="transform rotate-90" size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}