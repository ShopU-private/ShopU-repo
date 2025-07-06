import React, { useState, useEffect } from 'react';
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState<Set<number | string>>(new Set());
  const [visibleCards, setVisibleCards] = useState(1);
  const { addItem } = useCart();
  const [addingProductId, setAddingProductId] = useState<number | string | null>(null);

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

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else if (window.innerWidth < 1280) setVisibleCards(3);
      else setVisibleCards(4);
    };
    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  const nextSlide = () => {
    const maxSlides = Math.max(0, medicines.length - visibleCards);
    setCurrentSlide(prev => (prev >= maxSlides ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxSlides = Math.max(0, medicines.length - visibleCards);
    setCurrentSlide(prev => (prev <= 0 ? maxSlides : prev - 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* ✅ Reusable Health Category Component */}
        <HealthCategoryGrid healthCategories={healthCategories} />

        {/* Super Saver Products */}
        <section>
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Super Saver</h2>
              <p className="text-sm text-gray-600 sm:text-base">Up to 50% off</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`rounded-full p-1.5 sm:p-2 ${
                  currentSlide === 0
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                    : 'bg-gray-200 transition-colors hover:bg-gray-300'
                }`}
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlide >= medicines.length - visibleCards}
                className={`rounded-full p-1.5 sm:p-2 ${
                  currentSlide >= medicines.length - visibleCards
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                    : 'bg-gray-200 transition-colors hover:bg-gray-300'
                }`}
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[...Array(visibleCards)].map((_, index) => (
                  <div key={index} className="animate-pulse">
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
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${(currentSlide * 100) / visibleCards}%)` }}
              >
                {medicines.map(medicine => (
                  <div
                    key={medicine.id}
                    className="flex-shrink-0 px-1 sm:px-2"
                    style={{ width: `${100 / visibleCards}%` }}
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
                        image: '/medicine-placeholder.jpg', // Default placeholder since medicines don't have images
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
