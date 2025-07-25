'use client';

import React, { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, Camera, Check } from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface Product {
  id: number;
  name: string;
  price: string;
  features: string[];
  isOnSale: boolean;
}

interface ProductFromApi {
  id: string | number;
  name: string;
  price: number;
  discount?: number;
  description?: string;
  subCategory?: {
    name: string;
  };
}

const DealOfTheWeek = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 71,
    hours: 20,
    minutes: 60,
    seconds: 0,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  const { addItem } = useCart();

  // Fetch deals
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/product?discount=true&limit=4');

        if (res.ok) {
          const data = await res.json();
          const dealsProducts: Product[] =
            data.products?.map((product: ProductFromApi) => ({
              id: Number(product.id),
              name: product.name,
              price: `₹${product.price}`,
              features: [
                product.description?.split('.')[0] || 'Quality product',
                product.subCategory?.name || 'Essential item',
                `${product.discount || 20}% discount`,
              ],
              isOnSale: true,
            })) || [];

          setProducts(dealsProducts);
          setCurrentIndex(0);
        } else {
          console.log('Error fetching deals:');
        }
      } catch (err) {
        console.error('Error fetching deals:', err);
        setProducts([
          {
            id: 1,
            name: 'Moov Pain Relief Ointment',
            price: '₹165',
            features: ['Relieves pain', 'Soothes muscles', 'Quick relief'],
            isOnSale: true,
          },
          {
            id: 2,
            name: 'Vitamin C 500mg Sugarless',
            price: '₹199',
            features: ['Boost immunity', 'No sugar', 'Tasty chewables'],
            isOnSale: false,
          },
        ]);
        setCurrentIndex(0);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.days === 0 && prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          return prev;
        }

        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0)
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };

        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle responsive view
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 640 ? 1 : 2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddToCart = async (product: Product) => {
    setAddingProductId(product.id);
    try {
      await addItem(product.id.toString(), null, 1);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      console.error('Add to cart failed:', err);
    } finally {
      setAddingProductId(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + itemsPerPage < products.length) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerPage);

  console.log('Products:', products);
  console.log('Visible:', visibleProducts);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-6 w-48 rounded bg-gray-200"></div>
              <div className="h-4 w-24 rounded bg-gray-200"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-48 rounded-lg bg-gray-200"></div>
            <div className="h-48 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  // if (visibleProducts.length === 0) {
  //   return <div className="text-center py-10 text-gray-500">No deals available.</div>;
  // }

  const ProductCard = () => (
    <div className={`grid gap-4 ${itemsPerPage === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {visibleProducts.map(product => (
        <div
          key={product.id}
          className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex gap-4 sm:flex-row">
            <div className="relative">
              <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-gray-200 sm:h-32 sm:w-32">
                <Camera className="h-6 w-6 text-gray-400" />
              </div>
              {product.isOnSale && (
                <span className="absolute -top-2 -left-2 rounded bg-teal-600 px-2 py-1 text-xs text-white">
                  Sale
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-teal-800">{product.name}</h3>
              <p className="text-xl font-bold text-teal-700">{product.price}</p>
              <ul className="mt-2 space-y-1">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-teal-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={addingProductId === product.id}
                className="mt-4 flex items-center gap-1 rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
              >
                {addingProductId === product.id ? (
                  <span>Adding...</span>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>ADD</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop view */}
      <section className="mx-auto hidden max-w-6xl p-6 sm:block">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-primaryColor text-2xl font-semibold">
              Deal of <span className="text-secondaryColor">The Week</span>
            </h2>
            <div className="flex justify-center gap-2 sm:justify-start">
              {['days', 'hours', 'minutes', 'seconds'].map(unit => (
                <div
                  key={unit}
                  className="bg-background2 rounded px-2 py-1.5 text-center text-sm font-medium text-white"
                >
                  <div className="text-base font-bold">
                    {timeLeft[unit as keyof typeof timeLeft]}
                  </div>
                  <div className="capitalize">{unit}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                currentIndex === 0
                  ? 'bg-gray-200 text-gray-400'
                  : 'bg-teal-100 text-teal-600 hover:bg-teal-200'
              }`}
            >
              <ChevronLeft />
            </button>
            <button
              onClick={handleNext}
              disabled={currentIndex + itemsPerPage >= products.length}
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                currentIndex + itemsPerPage >= products.length
                  ? 'bg-gray-200 text-gray-400'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
        <ProductCard />
      </section>

      {/* Mobile view*/}
      <section className="block p-4 sm:hidden">
        <div className="mb-4 flex items-center justify-center gap-2">
          <h2 className="text-primaryColor text-md mt-1 text-center font-semibold">
            Deal of <span className="text-secondaryColor">The Week</span>
            <hr className="mt-2 w-36 border-2" />
          </h2>
          <div className="flex justify-center gap-2">
            {['days', 'hours', 'minutes', 'seconds'].map(unit => (
              <div
                key={unit}
                className="bg-background2 rounded px-1.5 py-1 text-center text-xs font-medium text-white"
              >
                <div className="text-sm font-medium">{timeLeft[unit as keyof typeof timeLeft]}</div>
                <div className="capitalize">{unit}</div>
              </div>
            ))}
          </div>
        </div>
        <ProductCard />
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              currentIndex === 0
                ? 'bg-gray-200 text-gray-400'
                : 'bg-teal-100 text-teal-600 hover:bg-teal-200'
            }`}
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex + itemsPerPage >= products.length}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              currentIndex + itemsPerPage >= products.length
                ? 'bg-gray-200 text-gray-400'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            <ChevronRight />
          </button>
        </div>
      </section>
    </>
  );
};

export default DealOfTheWeek;
