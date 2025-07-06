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

const DealOfTheWeek = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 71,
    hours: 19,
    minutes: 59,
    seconds: 57,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2); // default for desktop
  const { addItem } = useCart();
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products with deals/discounts
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?discount=true&limit=4');

        if (response.ok) {
          const data = await response.json();

          // Transform products to match the expected format
          const dealsProducts: Product[] =
            data.products?.map((product: any) => ({
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
        } else {
          throw new Error('Failed to fetch deals');
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
        // Fallback products
        setProducts([
          {
            id: 1,
            name: 'Moov Pain Relief Ointment',
            price: '₹165',
            features: ['3 cleaning programs', 'Digital display', 'Memory for 1 user'],
            isOnSale: true,
          },
          {
            id: 2,
            name: 'Vitamin C 500mg Sugarless',
            price: '₹165',
            features: ['3 cleaning programs', 'Digital display', 'Memory for 1 user'],
            isOnSale: false,
          },
          {
            id: 3,
            name: 'Vicks Vaporub 10g',
            price: '₹60',
            features: ['Relieves cough', 'Soothes muscles', 'Fast action'],
            isOnSale: true,
          },
          {
            id: 4,
            name: 'Dettol Antiseptic Liquid',
            price: '₹99',
            features: ['Kills 99.9% germs', 'Multipurpose', 'Safe for skin'],
            isOnSale: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  // Update itemsPerPage on screen resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setItemsPerPage(width < 640 ? 1 : 2);
    };
    handleResize(); // set on load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
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

  // Navigate one by one regardless of itemsPerPage
  const handleNext = () => {
    if (currentIndex + itemsPerPage < products.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleAddToCart = async (product: Product) => {
    setAddingProductId(product.id);
    try {
      await addItem(product.id.toString(), null, 1);
      // Dispatch cart updated event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    } finally {
      setAddingProductId(null);
    }
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl bg-white p-4 sm:p-6">
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

  return (
    <div className="mx-auto max-w-6xl bg-white p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <h2 className="text-xl font-semibold text-teal-700 sm:text-2xl">Deal Of The Week</h2>
          <div className="flex gap-2">
            {['days', 'hours', 'minutes', 'seconds'].map(unit => (
              <div
                key={unit}
                className="rounded bg-teal-600 px-2 py-1.5 text-center text-xs font-medium text-white sm:px-3 sm:py-2 sm:text-sm"
              >
                <div className="text-base font-bold sm:text-lg">
                  {timeLeft[unit as keyof typeof timeLeft]}
                </div>
                <div className="capitalize">{unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors sm:h-10 sm:w-10 ${
              currentIndex === 0
                ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                : 'bg-teal-100 text-teal-600 hover:bg-teal-200'
            }`}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex + itemsPerPage >= products.length}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors sm:h-10 sm:w-10 ${
              currentIndex + itemsPerPage >= products.length
                ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* Product cards */}
      <div className={`grid gap-4 sm:gap-6 ${itemsPerPage === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {visibleProducts.map(product => (
          <div
            key={product.id}
            className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-lg sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              {/* Image */}
              <div className="relative mx-auto sm:mx-0">
                <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-gray-200 sm:h-32 sm:w-32">
                  <Camera className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />
                </div>
                {product.isOnSale && (
                  <span className="absolute -top-2 -left-2 rounded bg-teal-600 px-2 py-1 text-[10px] text-white sm:text-xs">
                    Sale
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="mb-1 text-base font-semibold text-teal-800 sm:text-lg">
                  {product.name}
                </h3>
                <p className="mb-3 text-lg font-bold text-teal-700 sm:text-xl">{product.price}</p>
                <div className="mb-4 space-y-1.5">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-teal-500 sm:h-4 sm:w-4" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={addingProductId === product.id}
                  className="group flex items-center space-x-1 rounded-lg bg-teal-600 px-3 py-1.5 text-white transition-colors hover:bg-teal-700 sm:px-4 sm:py-2"
                >
                  {addingProductId === product.id ? (
                    <span>Adding...</span>
                  ) : (
                    <>
                      <Plus className="h-3 w-3 transition-transform group-hover:rotate-90 sm:h-4 sm:w-4" />
                      <span className="text-xs sm:text-sm">ADD</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealOfTheWeek;
