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
    setFavorites(prev =>
      prev.includes(medicineId) ? prev.filter(id => id !== medicineId) : [...prev, medicineId]
    );
  };

  const handleAddToCart = async (medicine: Medicine) => {
    setAddingIds(prev => [...prev, medicine.id]);
    try {
      await addItem(null, medicine.id.toString(), 1);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setTimeout(() => {
        setAddingIds(prev => prev.filter(id => id !== medicine.id));
      }, 1000);
    }
  };

  return (

    <section className="py-6 sm:py-8 bg-white">
      <div className="container max-w-7xl mx-auto px-4 w-[90%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-xl font-semibold text-[#317C80] mb-4">Everyday <span className="text-[#E93E40]">Essentials</span><hr className="bg-[#317C80] w-48 h-1 border-0 rounded mt-1" /> </h2>
                 <button className="text-sm font-medium bg-[#317C80] text-white py-1 px-3 rounded cursor-pointer">
          View All <span className="text-lg">{'>'}</span>
        </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5">
          {loading ? (
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
              Failed to load medicines. Please try again.
            </div>
          ) : medicines.length === 0 ? (
            <div className="w-full py-4 text-center text-gray-500">No medicines found.</div>
          ) : (
            medicines.map(medicine => (
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
