'use client';

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
}

const PersonalCareSection = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addingIds, setAddingIds] = useState<(number | string)[]>([]);
  const { addItem } = useCart();

  // Fetch medicines filtered by personal care type
  const { medicines, loading, error } = useMedicines({
    type: 'allopathy', // Filter by medicine type
    limit: 5,
  });

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleAddToCart = async (product: Product) => {
    setAddingIds(prev => [...prev, product.id]);

    try {
      // Use medicineId instead of productId for medicines
      await addItem(null, product.id.toString(), 1);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setTimeout(() => {
        setAddingIds(prev => prev.filter(id => id !== product.id));
      }, 1000);
    }
  };

  return (
    <section className="bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto w-[90%] max-w-7xl px-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="mb-4 text-xl font-semibold text-[#317C80] sm:text-xl">
            Personal <span className="text-[#E93E40]">Care</span>
            <hr className="mt-1 h-1 w-32 rounded border-0 bg-[#317C80]" />{' '}
          </h2>
          <button className="cursor-pointer rounded bg-[#317C80] px-3 py-1 text-sm font-medium text-white">
            View All <span className="text-lg">{'>'}</span>
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5">
          {loading ? (
            // Loading skeleton
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="min-w-[180px] animate-pulse sm:min-w-0">
                  <div className="mb-2 h-[200px] rounded-lg bg-gray-200"></div>
                  <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                </div>
              ))
          ) : error ? (
            <div className="w-full py-4 text-center text-red-500">
              Failed to load products. Please try again.
            </div>
          ) : medicines.length === 0 ? (
            <div className="w-full py-4 text-center text-gray-500">
              No personal care medicines found.
            </div>
          ) : (
            medicines.map(medicine => (
              <div key={medicine.id} className="min-w-[180px] sm:min-w-0">
                <ProductCard
                  product={{
                    ...medicine,
                    id: Number(medicine.id),
                    // Custom display for medicine cards
                    name: `${medicine.name} (${medicine.packSizeLabel || 'Standard'})`,
                    image: medicine.imageUrl || '/medicine-placeholder.jpg',
                    rating: typeof medicine.rating === 'number' ? medicine.rating : 0,
                  }}
                  // Pass subtitle as a separate prop if ProductCard supports it, otherwise remove this line
                  // subtitle={medicine.manufacturerName}
                  isFavorite={favorites.includes(Number(medicine.id))}
                  onToggleFavorite={() => toggleFavorite(Number(medicine.id))}
                  onAddToCart={() => handleAddToCart(medicine)}
                  isAdding={addingIds.includes(medicine.id)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PersonalCareSection;
