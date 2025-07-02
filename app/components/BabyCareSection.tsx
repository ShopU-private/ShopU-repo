import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { useMedicines } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';

interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image?: string;
  imageUrl?: string;
  category: string;
  manufacturerName?: string;
  packSizeLabel?: string;
  subtitle?: string;
}

const BabyCareSection = () => {
  const [favorites, setFavorites] = useState<Set<number | string>>(new Set());
  const [addingProductId, setAddingProductId] = useState<number | string | null>(null);
  const { addItem } = useCart();
  
  // Fetch medicine with "baby care" type
   const {  medicines, loading, error } = useMedicines({
     type: 'Baby-Care', // Filter by medicine type
     limit: 5,
   });
  
  const toggleFavorite = (id: number | string) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleAddToCart = async (product: Product) => {
    setAddingProductId(product.id);
    try {
      // Use medicineId instead of productId for medicines
      await addItem(null, product.id.toString(), 1);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setTimeout(() => {
        setAddingProductId(null);
      }, 600);
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b-4 border-[var(--shopu-color,#008080)] pb-1">
          Baby <span className="text-[var(--shopu-color,#008080)]">Care</span>
        </h2>
        <button className="text-sm font-medium text-[var(--shopu-color,#008080)] hover:underline flex items-center gap-1">
          View All <span className="text-lg">{'>'}</span>
        </button>
      </div>

      {/* Horizontal Scrollable Card Row */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 sm:gap-4">
          {loading ? (
            // Loading skeleton
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px] animate-pulse">
                <div className="bg-gray-200 h-[180px] rounded-lg mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))
          ) : error ? (
            <div className="text-red-500">Failed to load baby care medicines</div>
          ) : medicines.length === 0 ? (
            <div className="text-gray-500">No baby care medicines found</div>
          ) : (
            medicines.map((medicine) => (
              <div key={medicine.id} className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]">
                <ProductCard
                  product={{
                    ...medicine,
                    // Custom display for medicine cards
                    name: `${medicine.name} (${medicine.packSizeLabel || 'Standard'})`,
                    subtitle: medicine.manufacturerName,
                    image: medicine.imageUrl || '/medicine-placeholder.jpg',
                  }}
                  isFavorite={favorites.has(medicine.id)}
                  onToggleFavorite={() => toggleFavorite(medicine.id)}
                  onAddToCart={() => handleAddToCart(medicine)}
                  isAdding={addingProductId === medicine.id}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default BabyCareSection;
