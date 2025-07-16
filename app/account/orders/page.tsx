'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader, AlertCircle, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  userId: string;
  items?: OrderItem[];
  totalAmount: number;
  shippingAddress?: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod?: string;
  paymentStatus?: string;
  orderStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/orders');

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/');
          } else {
            const errorData = await response.json();
            toast.error(errorData.message || 'Failed to fetch orders');
          }
          return;
        }

        const data = await response.json();
        console.log('Fetched orders:', data);
        setOrders(data.orders ?? []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

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
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="max-w-md rounded-lg bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-xl font-bold text-gray-900">Something went wrong</h3>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center">
        <ShoppingBag className="h-16 w-16 text-gray-300" />
        <h2 className="mt-4 text-2xl font-bold text-gray-900">No orders yet</h2>
        <p className="mt-2 text-center text-gray-600">
          You haven&apos;t placed any orders yet. Start shopping to place your first order!
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 rounded-lg bg-teal-600 px-6 py-2 text-white hover:bg-teal-700"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 sm:text-3xl">My Orders</h1>

      <div className="space-y-8">
        {orders.map(order => (
          <div
            key={order._id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow"
          >
            {/* Order Header */}
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm text-gray-500">
                    Order placed on{' '}
                    <span className="font-medium">{formatDate(order.createdAt)}</span>
                  </p>
                  <p className="text-xs text-gray-500">Order ID: {order._id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(order.orderStatus)}`}
                  >
                    {order.orderStatus ?? 'Unknown'}
                  </span>
                  <button
                    onClick={() => router.push(`/orders/${order._id}`)}
                    className="rounded-md border border-teal-600 bg-white px-3 py-1 text-xs font-medium text-teal-600 hover:bg-teal-50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="divide-y divide-gray-200">
              {(order.items ?? []).slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-center px-4 py-4 sm:px-6">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                    {item.image ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover object-center"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="ml-4 min-w-0 flex-1">
                    <h4 className="line-clamp-1 text-sm font-medium text-gray-900">{item.name}</h4>
                    <p className="mt-1 text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹{item.price}</p>
                  </div>
                </div>
              ))}

              {(order.items?.length ?? 0) > 2 && (
                <div className="bg-gray-50 px-4 py-3 text-center text-sm text-gray-500">
                  + {(order.items?.length ?? 0) - 2} more item(s)
                </div>
              )}
            </div>

            {/* Order Footer */}
            <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6">
              <div className="flex justify-between">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Payment Method:</span>{' '}
                  {order.paymentMethod ?? 'N/A'}
                </p>
                <p className="text-sm font-medium text-gray-900">
                  Total: ₹{Number(order.totalAmount ?? 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
