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
          const dealsProducts: Product[] = data.products?.map((product: any) => ({
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
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
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
      <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="flex space-x-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
          <div className="grid gap-6 grid-cols-2">
            <div className="h-48 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white w-[90%]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-teal-700">Deal Of The Week</h2>
          <div className="flex gap-2">
            {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
              <div
                key={unit}
                className="bg-teal-600 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-medium text-center"
              >
                <div className="text-base sm:text-lg font-bold">
                  {timeLeft[unit as keyof typeof timeLeft]}
                </div>
                <div className="capitalize">{unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <div className="flex gap-2 justify-end">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${
              currentIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-teal-100 hover:bg-teal-200 text-teal-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex + itemsPerPage >= products.length}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${
              currentIndex + itemsPerPage >= products.length
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Product cards */}
      <div className={`grid gap-4 sm:gap-6 ${itemsPerPage === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {visibleProducts.map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Image */}
              <div className="relative mx-auto sm:mx-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                {product.isOnSale && (
                  <span className="absolute -top-2 -left-2 bg-teal-600 text-white text-[10px] sm:text-xs px-2 py-1 rounded">
                    Sale
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-teal-800 mb-1">{product.name}</h3>
                <p className="text-lg sm:text-xl font-bold text-teal-700 mb-3">{product.price}</p>
                <div className="space-y-1.5 mb-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-500" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={addingProductId === product.id}
                  className="bg-teal-600 text-white py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-1 group"
                >
                  {addingProductId === product.id ? (
                    <span>Adding...</span>
                  ) : (
                    <>
                      <Plus className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform" />
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