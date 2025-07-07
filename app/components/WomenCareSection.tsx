'use client';

import React, { useState, useRef } from 'react';
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

const WomenCareSection = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addingIds, setAddingIds] = useState<(number | string)[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  const { medicines, loading, error } = useMedicines({
    type: 'allopathy',
    limit: 10,
  });

  const toggleFavorite = (productId: number) => {
<<<<<<< HEAD
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
=======
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
>>>>>>> f6a1dc91063cebddc87d89c36f350f5a8279f26f
    );
  };

  const handleAddToCart = async (product: Product) => {
<<<<<<< HEAD
    setAddingIds(prev => [...prev, product.id]);

=======
    setAddingIds((prev) => [...prev, product.id]);
>>>>>>> f6a1dc91063cebddc87d89c36f350f5a8279f26f
    try {
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
<<<<<<< HEAD
    <section className="bg-gray-50 py-6 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Women Care</h2>
          <button className="text-sm font-medium text-teal-600 hover:underline">View All</button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5">
          {loading ? (
            // Loading skeleton
            Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="min-w-[250px] animate-pulse sm:min-w-0">
                  <div className="mb-2 h-[200px] rounded-lg bg-gray-200"></div>
                  <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                </div>
              ))
          ) : error ? (
            <div className="w-full py-4 text-center text-red-500">
              Failed to load women care products. Please try again.
            </div>
          ) : medicines.length === 0 ? (
            <div className="w-full py-4 text-center text-gray-500">
              No women care products found.
            </div>
          ) : (
            medicines.map(medicine => {
              const normalizedProduct = {
                ...medicine,
                id: Number(medicine.id),
                name: `${medicine.name} ${
                  medicine.packSizeLabel ? `(${medicine.packSizeLabel})` : ''
                }`,
                subtitle: medicine.manufacturerName,
                image: medicine.imageUrl || '/medicine-placeholder.jpg',
                rating: medicine.rating ?? 4.5,
                reviews: medicine.reviews ?? 25,
                category: medicine.category ?? '',
              };
              return (
                <div key={medicine.id} className="min-w-[250px] sm:min-w-0">
                  <ProductCard
                    product={normalizedProduct}
                    isFavorite={favorites.includes(Number(medicine.id))}
                    onToggleFavorite={() => toggleFavorite(Number(medicine.id))}
                    onAddToCart={() => handleAddToCart(normalizedProduct)}
                    isAdding={addingIds.includes(medicine.id)}
                  />
                </div>
              );
            })
          )}
=======
    <section className="py-6 sm:py-8 bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 w-[90%]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-xl font-semibold text-[#317C80] mb-4">
            Women <span className="text-[#E93E40]">Care</span>
            <hr className="bg-[#317C80] w-32 h-1 border-0 rounded mt-1" />
          </h2>
          <button className="text-sm font-medium bg-[#317C80] text-white py-1 px-3 rounded cursor-pointer">
            View All <span className="text-lg">{'>'}</span>
          </button>
        </div>

        <div className="relative">
          {/* Left Scroll Button */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-[-10px] top-1/2 transform -translate-y-1/2 z-10 bg-[#317C80] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scrollable product list */}
          <div
            ref={scrollRef}
            className="overflow-x-auto no-scrollbar"
          >
            <div className="flex gap-5 sm:gap-5 px-2 my-2">
              {medicines.map((medicine) => {
                const normalizedProduct = {
                  ...medicine,
                  id: Number(medicine.id),
                  name: `${medicine.name} ${medicine.packSizeLabel ? `(${medicine.packSizeLabel})` : ''}`,
                  subtitle: medicine.manufacturerName,
                  image: medicine.imageUrl || '/medicine-placeholder.jpg',
                  rating: medicine.rating ?? 4.5,
                  reviews: medicine.reviews ?? 25,
                  category: medicine.category ?? '',
                };

                return (
                  <div key={medicine.id} className="min-w-[210px]">
                    <ProductCard
                      product={normalizedProduct}
                      isFavorite={favorites.includes(Number(medicine.id))}
                      onToggleFavorite={() => toggleFavorite(Number(medicine.id))}
                      onAddToCart={() => handleAddToCart(normalizedProduct)}
                      isAdding={addingIds.includes(medicine.id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Scroll Button */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-[-10px] top-1/2 transform -translate-y-1/2 z-10 bg-[#317C80] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
>>>>>>> f6a1dc91063cebddc87d89c36f350f5a8279f26f
        </div>

      </div>
    </section>
  );
};

export default WomenCareSection;
