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
  const {  medicines, loading, error } = useMedicines({
    type: 'allopathy', // Filter by medicine type
    limit: 5,
  });

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleAddToCart = async (product: Product) => {
    setAddingIds((prev) => [...prev, product.id]);

    try {
      // Use medicineId instead of productId for medicines
      await addItem(null, product.id.toString(), 1);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setTimeout(() => {
        setAddingIds((prev) => prev.filter((id) => id !== product.id));
      }, 1000);
    }
  };

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Personal <span className="text-gray-500">Care</span>
          </h2>
          <button className="text-sm text-teal-600 hover:underline font-medium">View All</button>
        </div>

        <div className="flex overflow-x-auto gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible pb-2">
          {loading ? (
            // Loading skeleton
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="min-w-[180px] sm:min-w-0 animate-pulse">
                  <div className="bg-gray-200 h-[200px] rounded-lg mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                </div>
              ))
          ) : error ? (
            <div className="text-center w-full py-4 text-red-500">Failed to load products. Please try again.</div>
          ) : medicines.length === 0 ? (
            <div className="text-center w-full py-4 text-gray-500">No personal care medicines found.</div>
          ) : (
            medicines.map((medicine) => (
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