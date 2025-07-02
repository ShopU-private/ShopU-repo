'use client';

import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { useMedicines } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';

interface Medicine {
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

const EverydayEssentialsSection = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addingIds, setAddingIds] = useState<(number | string)[]>([]);
  const { addItem } = useCart();

  const { medicines, loading, error } = useMedicines({ limit: 5 });

  const toggleFavorite = (medicineId: number) => {
    setFavorites((prev) =>
      prev.includes(medicineId)
        ? prev.filter((id) => id !== medicineId)
        : [...prev, medicineId]
    );
  };

  const handleAddToCart = async (medicine: Medicine) => {
    setAddingIds((prev) => [...prev, medicine.id]);
    try {
      await addItem(null, medicine.id.toString(), 1);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setTimeout(() => {
        setAddingIds((prev) => prev.filter((id) => id !== medicine.id));
      }, 1000);
    }
  };

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Everyday <span className="text-gray-500">Essentials</span>
          </h2>
          <button className="text-sm text-teal-600 hover:underline font-medium">
            View All
          </button>
        </div>

        <div className="flex overflow-x-auto gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible pb-2">
          {loading ? (
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
            <div className="text-center w-full py-4 text-red-500">
              Failed to load medicines. Please try again.
            </div>
          ) : medicines.length === 0 ? (
            <div className="text-center w-full py-4 text-gray-500">
              No medicines found.
            </div>
          ) : (
            medicines.map((medicine) => (
              <div key={medicine.id} className="min-w-[180px] sm:min-w-0">
                <ProductCard
                  product={{
                    ...medicine,
                    name: `${medicine.name} (${medicine.packSizeLabel || 'Standard'})`,
                    subtitle: medicine.manufacturerName,
                    image: medicine.imageUrl || '/medicine-placeholder.jpg',
                  }}
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

export default EverydayEssentialsSection;
