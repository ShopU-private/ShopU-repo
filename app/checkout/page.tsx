'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/app/hooks/useCart';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useLocation } from '../context/LocationContext';
import { useRouter } from 'next/navigation';
import { logCheckoutEvent, validateAddressId } from '@/lib/checkout-utils';
import AddAddressForm from '../components/AddAddress';

type Address = {
  id?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
};

// type Props= {
//   mode: "add" | "edit";
//   initialData: Address | null
//   onCancel: () => void
//   onSave: (data:Address)=>void
// };

export default function CheckoutPage() {
  const { cartItems, isLoading } = useCart();
  const { setAddressId } = useLocation();
  const [subtotal, setSubtotal] = useState(0);
  const router = useRouter();

  const [address, setAddress] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  useEffect(() => {
    console.log("fetching address ");
    
    const fetchAddress = async () => {
      try {
        setIsLoadingAddress(true);
        const res = await fetch("/api/account/address", {
          method: "GET",
          credentials: "include",
          cache: 'no-store'
        });
        console.log("res status", res.status);
        
        if (!res.ok) 
          throw new Error("Failed to fetch address");

        const json = await res.json();
        console.log("address list:", json?.address || []);        
        setAddress(json?.address|| [])
        
      } catch (error) {
        console.error("Error fetching address:", error);
      } finally {
        setIsLoadingAddress(false);
      }
    };
    fetchAddress();
  }, []);

  useEffect(() => {
    logCheckoutEvent('Address selection changed', selectedAddressId);
  }, [selectedAddressId]);

  useEffect(() => {
    const total = cartItems.reduce((sum: number, item) => {
      const itemPrice: number = Number(item.product?.price ?? item.medicine?.price ?? 0);
      const quantity: number = typeof item.quantity === 'number' ? item.quantity : 0;
      return Number(sum) + itemPrice * quantity;
    }, 0);
    setSubtotal(total);
  }, [cartItems]);

  const handleProceedToPayment = () => {
    if (!validateAddressId(selectedAddressId)) {
      alert('Please select a valid delivery address');
      return;
    }

    setAddressId(selectedAddressId);
    const totalAmount = subtotal + (subtotal > 500 ? 0 : 40);

    if (totalAmount <= 0) {
      alert('Invalid order amount');
      return;
    }

    router.push(`/checkout/payment?addressId=${selectedAddressId}&amount=${totalAmount}`);
  };

    const handleAddressSave = (newAddress: Address) => {
  if (formMode === "edit") {
    // Update existing address
    setAddress(prev => 
      prev.map(addr => 
        addr.id === newAddress.id ? newAddress : addr
      )
    );
  } else {
    // Add new address
    setAddress(prev => [...prev, newAddress]);
  }
  setSelectedAddressId(newAddress.id ?? '');
};

  if (isLoading || isLoadingAddress) {
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

  const handleDelAddress = async (id: string) =>{ 
    try {
      const res = await fetch (`/api/account/address/${id}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (res.ok) {
        setAddress((prev) => prev.filter((addr) => addr.id !==id ))
      }else{
        console.error("Delete failed:", await res.text())
      }
    } catch (error) {
      console.error("Error deleting address:" , error)
    }
  }

  return (
    <div className="min-h-[60vh] px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">Checkout</h1>

        <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Delivery Address</h2>

          {address.length === 0 ? (
            <div className="py-4 text-center">
              <p className="mb-3 text-gray-600">No saved addresses found.</p>
              <button
                onClick={() => {
                  setFormMode("add")
                  setShowAddAddressForm(true)
                  setSelectedAddress(null)
                }}
                className="text-teal-600 hover:underline"
              >
                + Add a new address
              </button>
            </div>
          ) : (
            <div className="space-y-3 relative">
              {address.map(address => (
                <div
                  key={address.id}
                  className={`cursor-pointer rounded-lg border p-3 ${selectedAddressId === address.id
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => setSelectedAddressId(address.id ?? "")}
                >
                
                  <div className="flex items-start">
                    <input
                      type="radio"
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id ?? "")}
                      className="mt-1 h-4 w-4 text-teal-600"
                    />
                    <div className="ml-3">
                      <p className="font-medium">{address.fullName}</p>
                      <p className="text-sm text-gray-600">
                        {address.addressLine1}
                        {address.addressLine2 ?  `,${address.addressLine2}` : ""}
                      </p>
                      <p className="text-sm text-gray-600">
                        {address.city} {address.state} {address.postalCode}
                      </p>
                      <p className="text-sm text-gray-600">{address.phoneNumber}</p>
                      <button onClick={() =>{
                        setFormMode("edit")
                        setSelectedAddress(address)
                        setShowAddAddressForm(true)
                      }}>
                          Edit
                      </button>
                      <button 
                      className='text-red-600 cursor-pointer'
                      onClick={() => handleDelAddress(address.id ?? "")}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setShowAddAddressForm(true)}
                className="absolute right-0 -bottom-8 text-sm mt-2 text-teal-600 hover:underline"
              >
                + Add another address
              </button>
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold">Your Order Summary</h2>
          <div className="mb-6 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
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
              className={`rounded-lg ${!selectedAddressId || address.length === 0
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-teal-600 hover:bg-teal-700'
                } px-6 py-2 text-white`}
              onClick={handleProceedToPayment}
              disabled={!selectedAddressId || address.length === 0}
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>

      {showAddAddressForm && (
        <AddAddressForm
        formMode={formMode}
        initialData={selectedAddress}
          onCancel={() => {
            setShowAddAddressForm(false)          
            setSelectedAddress(null)
            setFormMode("add")
          }}
          onSave={(data) => {
            handleAddressSave(data)
            setShowAddAddressForm(false)
            setSelectedAddress(null)
            setFormMode("add")
          }}
        />
      )}
    </div>
  );
}