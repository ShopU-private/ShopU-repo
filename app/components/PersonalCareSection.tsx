'use client';

import React, { useState, useRef } from 'react';
import ProductCard from './ProductCard';
import { useMedicines } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useRouter } from 'next/navigation';

const PersonalCareSection = () => {
  const [favorites, setFavorites] = useState<Set<number | string>>(new Set());
  const [addingProductId, setAddingProductId] = useState<number | string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const router = useRouter();

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

  const handleView = () => {
    router.push('/product?category=PersonalCare'); //Change path as per your route
  };

  return (
    <section className="py-6 sm:py-8">
      <div className="container mx-auto w-[90%] max-w-7xl px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-primaryColor mb-4 text-xl font-semibold sm:text-xl">
            Personal <span className="text-secondaryColor">Care</span>
            <hr className="bg-background1 mt-1 h-1 w-32 rounded border-0" />{' '}
          </h2>
          <button className="bg-background1 cursor-pointer rounded px-3 py-1 text-sm font-medium text-white">
            View All <span className="text-lg">{'>'}</span>
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="bg-background1 absolute top-1/2 left-[-15px] z-10 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full text-white shadow-md"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {loading ? (
            <div className="no-scrollbar flex gap-4 overflow-x-auto px-1">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="min-w-[240px] animate-pulse">
                  <div className="mb-2 h-52 rounded-lg bg-gray-200"></div>
                  <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-secondaryColor py-8 text-center">
              Failed to load women care. Please try again.
            </div>
          ) : medicines.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No women care available.</div>
          ) : (
            <div
              ref={scrollRef}
              className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth py-4"
            >
              {medicines.map(medicine => (
                <div key={medicine.id} className="max-w-[210px] min-w-[210px]">
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
            className="bg-background1 absolute top-1/2 right-[-15px] z-10 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full text-white shadow-md"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PersonalCareSection;
