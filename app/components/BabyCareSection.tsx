'use client';

import React, { useState, useRef } from 'react';
import ProductCard from './ProductCard';
import { useMedicines } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
// ✅ FIXED: App Router wala import

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -460 : 460,
        behavior: 'smooth',
      });
    }
  };

  const { medicines, loading, error } = useMedicines({
    type: 'allopathy',
    limit: 10,
  });

  const toggleFavorite = (id: number | string) => {
    setFavorites((prev) => {
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

  return (
    <section className="px-4 sm:px-6 lg:px-4 py-6 max-w-7xl mx-auto w-[90%]">
      {/* Section Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-xl font-semibold text-primaryColor mb-4">Baby <span className="text-secondaryColor">Care</span><hr className="bg-background1 w-24 h-1 border-0 rounded mt-1" /> </h2>
        <a href="/Product/ProductsById" className="text-sm font-medium bg-background1 text-white py-1 px-3 rounded cursor-pointer">
          View All <span className="text-lg">{'>'}</span>
        </a>
      </div>

      {/* Horizontal Scrollable Card Row */}
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-[-15px] top-1/2 transform -translate-y-1/2 z-10 bg-background1 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {loading ? (
          <div className="flex gap-4 overflow-x-auto no-scrollbar px-1">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="min-w-[240px] animate-pulse">
                <div className="bg-gray-200 h-52 rounded-lg mb-2"></div>
                <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-secondaryColor">
            Failed to load women care. Please try again.
          </div>
        ) : medicines.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No women care available.</div>
        ) : (
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-5 no-scrollbar scroll-smooth py-4"
          >
            {medicines.map((medicine) => (
              <div
                key={medicine.id}
                className="min-w-[210px] max-w-[210px]"
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
                    image: medicine.imageUrl || '/medicine-placeholder.jpg',
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
        {/* Right Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-[-15px] top-1/2 transform -translate-y-1/2 z-10 bg-background1 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

    </section>
  );
};

export default BabyCareSection;