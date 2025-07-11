import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/ProductCard';
import HealthCategoryGrid from '../components/HealthCategoryGrid';
import { useMedicines } from '../hooks/useProducts';

interface HealthCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const ShopUHealthComponent: React.FC = () => {
  const [favorites, setFavorites] = useState<Set<number | string>>(new Set());
  const { addItem } = useCart();
  const [addingProductId, setAddingProductId] = useState<number | string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch medicines for the Super Saver section
  const { medicines, loading, error } = useMedicines({
    limit: 10,
  });

  const healthCategories: HealthCategory[] = [
    { id: 'diabetes', name: 'Diabetes Care', icon: '🩺' },
    { id: 'cardiac', name: 'Cardiac Care', icon: '❤️' },
    { id: 'elderly', name: 'Elderly Care', icon: '👴' },
    { id: 'oral', name: 'Oral Care', icon: '🦷' },
    { id: 'stomach', name: 'Stomach Care', icon: '🫁' },
    { id: 'pain', name: 'Pain Relief', icon: '💊' },
    { id: 'liver', name: 'Liver Care', icon: '🫀' },
  ];

  const toggleFavorite = (id: number | string) => {
    setFavorites(prev => {
      const updated = new Set(prev);
      if (updated.has(id)) {
        updated.delete(id);
      } else {
        updated.add(id);
      }
      return updated;
    });
  };

  const handleAddToCart = async (medicineId: string) => {
    setAddingProductId(medicineId);
    try {
      await addItem(null, medicineId, 1);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Add to cart failed:', error);
    } finally {
      setAddingProductId(null);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = 260; // Adjust based on card size + gap
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-xl bg-gray-50">
      <div className="mx-auto w-[90%] max-w-7xl px-4 py-6">
        {/* ✅ Health Category Section */}
        <HealthCategoryGrid healthCategories={healthCategories} />

        {/* ✅ Super Saver Section */}
        <section className="mx-auto py-4">
          <div className="mb-4 flex items-center justify-between sm:mb-8">
            <div>
              <h2 className="text-xl font-semibold text-[#317C80] sm:text-xl">
                Super Saver <span className="text-[#E93E40]">Up to 50% off</span>
                <hr className="mt-1 h-1 rounded border-0 bg-[#317C80]" />{' '}
              </h2>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => scroll('left')}
                className="rounded-full bg-gray-200 p-1.5 transition-colors hover:bg-gray-300 sm:p-2"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="rounded-full bg-gray-200 p-1.5 transition-colors hover:bg-gray-300 sm:p-2"
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          <div className="relative">
            {loading ? (
              <div className="no-scrollbar flex gap-4 overflow-x-auto px-1">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="min-w-[240px] animate-pulse">
                    <div className="mb-2 h-52 rounded-lg bg-gray-200"></div>
                    <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                    <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-8 text-center text-red-500">
                Failed to load medicines. Please try again.
              </div>
            ) : medicines.length === 0 ? (
              <div className="py-8 text-center text-gray-500">No medicines available.</div>
            ) : (
              <div
                ref={scrollRef}
                className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth px-1"
              >
                {medicines.map(medicine => (
                  <div
                    key={medicine.id}
                    className="max-w-[240px] min-w-[240px] flex-shrink-0 bg-white"
                  >
                    <ProductCard
                      product={{
                        id: medicine.id,
                        name: `${medicine.name} ${medicine.packSizeLabel ? `(${medicine.packSizeLabel})` : ''}`,
                        price: medicine.price,
                        originalPrice: medicine.originalPrice || medicine.price * 1.2,
                        discount: medicine.discount || 20,
                        rating: medicine.rating || 4.5,
                        reviews: medicine.reviews || 100,
                        image: '/medicine-placeholder.jpg',
                        category: medicine.type || 'Medicine',
                        subtitle: medicine.manufacturerName,
                      }}
                      isFavorite={favorites.has(medicine.id)}
                      onToggleFavorite={() => toggleFavorite(medicine.id)}
                      onAddToCart={() => handleAddToCart(medicine.id)}
                      isAdding={addingProductId === medicine.id}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShopUHealthComponent;
