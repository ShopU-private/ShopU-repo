'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/app/hooks/useCart';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useLocation } from '../context/LocationContext';
import { useRouter } from 'next/navigation';
import { logCheckoutEvent, validateAddressId } from '@/lib/checkout-utils';

export default function CheckoutPage() {
  const { cartItems, isLoading } = useCart();
  const { location, setAddressId } = useLocation();
  const [subtotal, setSubtotal] = useState(0);
  const router = useRouter();

  interface Address {
    id: string;
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    phoneNumber: string;
    isDefault: boolean;
  }

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

  useEffect(() => {
    let addressesFromContext: Address[] = [];

    if (location?.address) {
      if (typeof location.address === 'object') {
        addressesFromContext = [location.address as Address];
      } else if (typeof location.address === 'string') {
        // Create a normalized address object with required fields for API
        addressesFromContext = [
          {
            id: 'temp-address-id', // We'll replace this on the backend
            fullName: 'Delivery Address',
            addressLine1: location.address,
            city: location.city || 'Unknown',
            state: location.state || 'Unknown',
            postalCode: location.pincode || '503301',
            phoneNumber: '9999999999',
            isDefault: true,
          },
        ];
      }
    }

    setAddresses(addressesFromContext);

    if (addressesFromContext.length > 0) {
      const defaultAddress = addressesFromContext.find(addr => addr.isDefault);
      const selected = defaultAddress || addressesFromContext[0];
      setSelectedAddressId(selected.id);
      logCheckoutEvent(
        defaultAddress ? 'Selected default address' : 'Selected first address',
        selected.id
      );
    }

    setIsLoadingAddresses(false);
  }, [location?.address, location?.pincode, location?.city, location?.state]);

  useEffect(() => {
    if (selectedAddressId) {
      logCheckoutEvent('Address selection changed', selectedAddressId);
    }
  }, [selectedAddressId]);

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      const itemPrice = item.product?.price || item.medicine?.price || 0;
      return sum + itemPrice * item.quantity;
    }, 0);
    setSubtotal(total);
  }, [cartItems]);

  const handleProceedToPayment = () => {
    if (!validateAddressId(selectedAddressId)) {
      alert('Please select a valid delivery address');
      return;
    }

    setAddressId(selectedAddressId);

    logCheckoutEvent('Proceeding to payment with address', selectedAddressId);

    const totalAmount = subtotal + (subtotal > 500 ? 0 : 40);
    if (totalAmount <= 0) {
      alert('Invalid order amount');
      return;
    }

    router.push(`/checkout/payment?addressId=${selectedAddressId}&amount=${totalAmount}`);
  };

  if (isLoading || isLoadingAddresses) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] px-4 py-8">
        <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
          <div className="flex flex-col items-center justify-center py-12">
            <h2 className="mb-2 text-2xl font-medium text-gray-700">Your cart is empty</h2>
            <p className="mb-6 text-center text-gray-500">
              You need to add items to your cart before checkout.
            </p>
            <Link
              href="/"
              className="bg-background1 rounded-lg px-6 py-3 text-white transition-all hover:bg-teal-700"
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

        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Delivery Address</h2>
          {addresses.length === 0 ? (
            <div className="py-4 text-center">
              <p className="mb-3 text-gray-600">No saved addresses found.</p>
              <Link href="/account/myAddresses" className="text-primaryColor hover:underline">
                Add a new address
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map(address => (
                <div
                  key={address.id}
                  className={`cursor-pointer rounded-lg border p-3 ${selectedAddressId === address.id ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setSelectedAddressId(address.id)}
                >
                  <div className="flex items-start">
                    <input
                      type="radio"
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="mt-1 h-4 w-4 text-teal-600"
                    />
                    <div className="ml-3">
                      <p className="font-medium">{address.fullName}</p>
                      <p className="text-sm text-gray-600">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p className="text-sm text-gray-600">{address.phoneNumber}</p>
                      {address.isDefault && (
                        <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-800">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Your Order Summary</h2>
          <div className="mb-6 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{subtotal > 500 ? 'Free' : '₹40.00'}</span>
            </div>
            <div className="mt-2 flex justify-between border-t pt-2 font-medium">
              <span>Total</span>
              <span>₹{(subtotal + (subtotal > 500 ? 0 : 40)).toFixed(2)}</span>
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
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
              className={`rounded-lg ${!selectedAddressId || addresses.length === 0 ? 'cursor-not-allowed bg-gray-400' : 'bg-background1'} cursor-pointer px-6 py-2 text-white duration-300 hover:scale-102`}
              onClick={handleProceedToPayment}
              disabled={!selectedAddressId || addresses.length === 0}
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
