'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/app/hooks/useCart';
import { Loader, ChevronUp, ChevronDown, Trash2, X, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLocation } from '../context/LocationContext';
import PaymentMethodModal from './PaymentMethodModal';

interface CartModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
}

export default function CartModal({ isOpen, onCloseAction }: CartModalProps) {
  const { cartItems, isLoading, updateCartItem, removeFromCart } = useCart();
  const [itemTotal, setItemTotal] = useState(0);
  const [processingAction, setProcessingAction] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { location } = useLocation();
  const deliveryAddress = location ? `${location.address}, PIN: ${location.pincode}` : "Please set delivery location";
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      const price = Number(item.product?.price || item.medicine?.price || 0);
      return sum + price * item.quantity;
    }, 0);
    setItemTotal(total);
    // Generate a pseudo-random order ID
    setOrderId(`order_${Date.now()}_${Math.floor(Math.random() * 1000)}`);
  }, [cartItems]);

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setProcessingAction((prev) => ({ ...prev, [id]: 'update' }));
    await updateCartItem(id, newQuantity);
    setProcessingAction((prev) => ({ ...prev, [id]: '' }));
  };

  const handleRemoveItem = async (id: string) => {
    setProcessingAction((prev) => ({ ...prev, [id]: 'remove' }));
    await removeFromCart(id);
    setProcessingAction((prev) => ({ ...prev, [id]: '' }));
  };

  const handleProceedToCheckout = () => {
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4">
      <div className="animate-slideUp relative w-full max-w-sm sm:max-w-md lg:max-w-lg max-h-[95vh] sm:max-h-[90vh] overflow-hidden transform rounded-2xl sm:rounded-3xl bg-white shadow-2xl transition-all">
        
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
        <div className="flex flex-col h-[calc(95vh-100px)] sm:h-[calc(90vh-120px)]">
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex min-h-[50vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Loader className="h-8 w-8 animate-spin text-teal-600" />
                  <p className="text-gray-500 text-sm">Loading your cart...</p>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
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
            ) : (
              <div className="space-y-4 p-4 sm:p-6">
                {/* Cart Items */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  {cartItems.map((item, index) => {
                    const price = Number(item.product?.price || item.medicine?.price || 0);
                    const name = item.product?.name || item.medicine?.name || 'Unknown Item';
                    const imageUrl = item.product?.imageUrl;

                    return (
                      <div key={item.id} className={`p-4 flex items-center gap-3 ${index !== cartItems.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        {/* Product Image */}
                        <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={name}
                              width={80}
                              height={80}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                              <ShoppingBag className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2 mb-1">{name}</h3>
                          <p className="text-xs sm:text-sm text-gray-500 mb-1">₹{price.toFixed(2)} each</p>
                          <p className="text-sm sm:text-base text-teal-600 font-semibold">
                            ₹{(price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-center gap-1">
                          <button
                            className="text-gray-400 hover:text-teal-600 transition-colors p-1 rounded-full hover:bg-teal-50"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            disabled={processingAction[item.id] === 'update'}
                          >
                            <ChevronUp size={16} />
                          </button>
                          <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="text-gray-400 hover:text-teal-600 transition-colors p-1 rounded-full hover:bg-teal-50 disabled:opacity-50"
                            onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1 || processingAction[item.id] === 'update'}
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button 
                          onClick={() => handleRemoveItem(item.id)} 
                          className="text-red-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
                          disabled={processingAction[item.id] === 'remove'}
                        >
                          {processingAction[item.id] === 'remove' ? (
                            <Loader className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Bill Details */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="bg-teal-50 px-4 py-3 border-b border-teal-100">
                    <h2 className="text-base font-semibold text-teal-800">Bill Summary</h2>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Item Total:</span>
                      <span className="font-medium">₹{itemTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery:</span>
                      <span className="text-teal-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-100">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="font-bold text-lg text-teal-600">₹{itemTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="bg-teal-50 px-4 py-3 border-b border-teal-100">
                    <h2 className="text-base font-semibold text-teal-800">Delivery Address</h2>
                  </div>
                  <div className="p-4 flex justify-between items-start gap-3">
                    <p className="text-sm text-gray-600 flex-1">{deliveryAddress}</p>
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

                {/* Cancellation Policy */}
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                    <h2 className="text-base font-semibold text-gray-800">Cancellation Policy</h2>
                  </div>
                  <div className="p-4 text-xs sm:text-sm text-gray-600 space-y-2">
                    <p>• Orders cannot be cancelled once packed for delivery.</p>
                    <p>• In case of unexpected delays, a refund will be provided, if applicable.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Checkout Button */}
          {cartItems.length > 0 && (
            <div className="bg-white border-t border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-center sm:text-left">
                  <p className="text-lg sm:text-xl font-bold text-gray-800">₹{itemTotal.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Inclusive of all taxes</p>
                </div>
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white px-6 sm:px-8 py-3 sm:py-4 font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  Proceed to Pay
                  <ChevronUp className="transform rotate-90" size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Payment Method Modal */}
      <PaymentMethodModal 
        isOpen={isPaymentModalOpen}
        onCloseAction={closePaymentModal} // Using onCloseAction instead of onClose
        amount={itemTotal}
        orderId={orderId}
      />
    </div>
  );
}