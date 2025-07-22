'use client';

import Image from 'next/image';
import { Loader, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Navroute from '../../components/navroute';
import toast from 'react-hot-toast';
import { useCart } from '../../hooks/useCart';
import { useRouter } from 'next/navigation';

interface WishlistItem {
  productId: string;
  id: string;
  name: string;
  image_url: string;
  price: number;
  createdAt: string;
  stock?: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingProductId, setRemovingProductId] = useState<string | null>(null);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const { addItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/account/wishlist');

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/');
          } else {
            const errorData = await res.json();
            toast.error(errorData.message || 'Failed to fetch wishlist');
          }
          return;
        }

        const data = await res.json();
        setWishlist(data);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        toast.error('Network or server error');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [router]);

  const handleRemove = async (productId: string) => {
    try {
      setRemovingProductId(productId);
      const res = await fetch(`/api/account/wishlist?productId=${productId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setWishlist(prev => prev.filter(item => item.productId !== productId));
        toast.success(data.message || 'Deleted item from wishlist');
      } else {
        toast.error(data.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Something went wrong while deleting');
    } finally {
      setRemovingProductId(null);
    }
  };

  const handleAddToCart = async (productId: string) => {
    setAddingProductId(productId);
    try {
      await addItem(null, productId, 1);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      console.error('Add to cart failed:', err);
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <>
      <Navroute />
      <div className="mx-auto max-w-7xl px-4 py-8">
        {loading ? (
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="text-center">
              <Loader className="mx-auto h-8 w-8 animate-spin text-teal-600" />
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-gray-500">Your wishlist is empty.</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden overflow-x-auto px-10 sm:block">
              <h2 className="text-primaryColor mb-4 text-xl font-semibold">
                Wish<span className="text-secondaryColor">list</span>
                <hr className="bg-background1 mt-1 h-1 w-24 rounded border-0" />
              </h2>
              <table className="min-w-full border-separate border-spacing-y-4">
                <thead>
                  <tr className="bg-[#D5F3F6] text-center text-sm text-gray-800">
                    <th className="px-4 py-4">Product</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Date Added</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Add to Cart</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {wishlist.map(item => (
                    <tr key={item.id} className="rounded-lg bg-white text-center shadow-sm">
                      <td className="flex items-center gap-3 px-6 py-4">
                        <Image
                          src={item.image_url}
                          alt={item.name.length > 5 ? item.name.slice(0, 5) + '…' : item.name}
                          width={50}
                          height={50}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-800">{item.name}</span>
                      </td>
                      <td className="text-primaryColor px-6 py-4 text-sm font-medium">
                        ₹{String(item.price).slice(0, 5)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-green-600">
                        {item.stock || 'In Stock'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleAddToCart(item.productId)}
                          disabled={addingProductId === item.productId}
                          className="hover:bg-opacity-90 rounded bg-[#317C80] px-4 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {addingProductId === item.productId ? 'Adding..' : 'ADD'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleRemove(item.productId)}
                          className="text-gray-500 hover:text-red-500 disabled:opacity-60"
                          disabled={removingProductId === item.productId}
                        >
                          {removingProductId === item.productId ? (
                            <Loader className="h-5 w-5 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="space-y-4 sm:hidden">
              <h2 className="text-primaryColor mb-6 text-lg font-medium">
                Wish<span className="text-secondaryColor">list</span>
                <hr className="bg-background1 mt-1 w-20 rounded border-2" />
              </h2>
              {wishlist.map(item => (
                <div key={item.id} className="mb-6 rounded-lg bg-white px-6 py-4 shadow-sm">
                  <div className="mb-2 flex justify-between text-sm text-gray-600">
                    <span className="text-lg font-medium text-black">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-green-600">{item.stock || 'In Stock'}</span>
                  </div>
                  <div className="flex items-center gap-4 py-6 font-medium">
                    <Image
                      src={item.image_url}
                      alt={item.name.length > 10 ? item.name.slice(0, 10) + '…' : item.name}
                      width={50}
                      height={50}
                    />
                    <div className="text-md flex-1 pr-4">
                      {item.name.length > 45 ? item.name.slice(0, 45) + '…' : item.name}
                    </div>
                    <div className="text-primaryColor text-lg">
                      ₹{String(item.price).slice(0, 5)}
                    </div>
                  </div>
                  <hr className="text-gray-300" />
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => handleAddToCart(item.productId)}
                      disabled={addingProductId === item.productId}
                      className="hover:bg-opacity-90 bg-background1 rounded px-4 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {addingProductId === item.productId ? 'Adding...' : 'ADD'}
                    </button>

                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-gray-500 hover:text-red-500 disabled:opacity-60"
                      disabled={removingProductId === item.productId}
                    >
                      {removingProductId === item.productId ? (
                        <Loader className="text-secondaryColor h-6 w-6 animate-spin" />
                      ) : (
                        <Trash2 className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
