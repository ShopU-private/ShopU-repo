'use client';

import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { useMedicines } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useRouter } from 'next/navigation'; // ✅ FIXED: App Router wala import

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
  const router = useRouter(); // ✅ Must be inside the component

  // Fetch medicines with "Baby-Care" type
  const { medicines, loading, error } = useMedicines({
    type: 'allopathy',
    limit: 5,
  });

  const handleView = () => {
    router.push('/product?category=allopathy'); // ✅ Change path as per your route
  };

  const toggleFavorite = (id: number | string) => {
    setFavorites(prev => {
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
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="border-b-4 border-[var(--shopu-color,#008080)] pb-1 text-xl font-semibold text-gray-800">
          Baby <span className="text-[var(--shopu-color,#008080)]">Care</span>
        </h2>
        <button
          onClick={handleView}
          className="flex items-center gap-1 text-sm font-medium text-[var(--shopu-color,#008080)] hover:underline"
        >
          View All <span className="text-lg">{'>'}</span>
        </button>
      </div>

      {/* Scrollable Card Row */}
      <div className="scrollbar-hide overflow-x-auto">
        <div className="flex gap-3 sm:gap-4">
          {loading ? (
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="w-[160px] flex-shrink-0 animate-pulse sm:w-[180px] md:w-[200px]"
                >
                  <div className="mb-2 h-[180px] rounded-lg bg-gray-200"></div>
                  <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                </div>
              ))
          ) : error ? (
            <div className="text-red-500">Failed to load baby care medicines</div>
          ) : medicines.length === 0 ? (
            <div className="text-gray-500">No baby care medicines found</div>
          ) : (
            medicines.map(medicine => (
              <div key={medicine.id} className="w-[160px] flex-shrink-0 sm:w-[180px] md:w-[200px]">
                <ProductCard
                  product={{
                    ...medicine,
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