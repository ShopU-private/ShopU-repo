'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Package, ShoppingBag, Truck, Loader, AlertCircle } from 'lucide-react';
import OrderTracking from './tracking';

import LiveTracking from '@/app/components/LiveTracking';
import OrderStatusUpdater from '@/app/components/OrderStatusUpdater';

interface OrderItem {
  id: string;
  productId: string | null;
  medicineId: string | null;
  quantity: number;
  price: number;
  status: string;
  product?: {
    name: string;
    imageUrl: string;
    productImage?: Array<{ url: string }>;
  };
  medicine?: {
    name: string;
    manufacturerName: string;
    packSizeLabel: string;
  };
  trackingNumber?: string | null;
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  address: {
    fullName: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2: string | null;
    city: string;
    state: string;
    postalCode: string;
  };
  orderItems: OrderItem[];
  trackingNumber?: string | null;
}

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/account/orders/${id}`);
        if (!response.ok) throw new Error('Failed to fetch order details');

        const data = await response.json();
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          throw new Error(data.error || 'Failed to fetch order');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    const checkAdminStatus = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user data');

        const data = await res.json();
        console.log('User data:', data);
        setIsAdmin(data.user?.role?.toUpperCase() === 'ADMIN');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    fetchOrderDetails();
    checkAdminStatus();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string = '') => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'returned':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <Loader className="mx-auto h-8 w-8 animate-spin text-teal-600" />
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="max-w-md rounded-lg bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-xl font-bold text-gray-900">Something went wrong</h3>
          <p className="mt-2 text-gray-600">{error || 'Failed to load order details'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Find the main tracking number (from either order or first shipped item)
  const getMainTrackingNumber = () => {
    if (order.trackingNumber) return order.trackingNumber;

    const shippedItem = order.orderItems.find(
      item =>
        item.trackingNumber &&
        (item.status.toLowerCase() === 'shipped' || item.status.toLowerCase() === 'delivered')
    );

    return shippedItem?.trackingNumber || null;
  };

  const mainTrackingNumber = getMainTrackingNumber();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to orders
        </button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{id.slice(-6)}</h1>
          <p className="text-sm text-gray-600">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <div className="mt-2 sm:mt-0">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Tracking Information */}
      <OrderTracking trackingNumber={mainTrackingNumber} />

      {/* Live Tracking - Admins only */}
      {isAdmin && order.trackingNumber && (
        <div className="mb-6">
          <LiveTracking awb={order.trackingNumber} orderId={order.id} isAdmin={isAdmin} />
        </div>
      )}

      {/* Order Items */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white shadow-sm">
        <h2 className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-lg font-medium">Items</h2>
        <ul className="divide-y divide-gray-200">
          {order.orderItems.map(item => {
            const itemName = item.product?.name || item.medicine?.name || 'Unknown Product';
            const itemImage =
              item.product?.imageUrl ||
              (item.product?.productImage && item.product.productImage[0]?.url);

            return (
              <li key={item.id} className="p-6">
                <div className="flex flex-col sm:flex-row">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-200">
                    {itemImage ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={itemImage}
                          alt={itemName}
                          fill
                          sizes="80px"
                          className="object-cover object-center"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        {item.medicineId ? (
                          <Package className="h-10 w-10 text-gray-400" />
                        ) : (
                          <ShoppingBag className="h-10 w-10 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex-1 sm:mt-0 sm:ml-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{itemName}</h3>
                        {item.medicine && (
                          <p className="mt-1 text-xs text-gray-500">
                            {item.medicine.manufacturerName} · {item.medicine.packSizeLabel}
                          </p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="mt-2 text-right sm:mt-0">
                        <p className="text-base font-medium text-gray-900">₹{item.price}</p>
                        <span
                          className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>

                    {item.trackingNumber && item.trackingNumber !== mainTrackingNumber && (
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <Truck className="mr-1 h-4 w-4 text-gray-500" />
                        <span>Tracking: {item.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin controls for each item */}
                {isAdmin && (
                  <div className="mt-4">
                    <OrderStatusUpdater
                      orderId={order.id}
                      itemId={item.id}
                      currentStatus={item.status}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Order Summary & Address */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Summary */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Order Summary</h2>
          <dl className="space-y-3">
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Payment Method</dt>
              <dd className="font-medium">{order.paymentMethod || 'N/A'}</dd>
            </div>
            <div className="flex justify-between text-sm">
              <dt className="text-gray-600">Order Status</dt>
              <dd>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </dd>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3">
              <dt className="font-medium">Total</dt>
              <dd className="text-lg font-bold text-teal-700">
                ₹{Number(order.totalAmount).toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>

        {/* Shipping Address */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-medium">Shipping Address</h2>
          {order.address ? (
            <div className="space-y-1 text-sm">
              <p className="font-medium">{order.address.fullName}</p>
              <p>{order.address.phoneNumber}</p>
              <p>{order.address.addressLine1}</p>
              {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
              <p>
                {order.address.city}, {order.address.state} {order.address.postalCode}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">Address information not available</p>
          )}
        </div>
      </div>
    </div>
  );
}
