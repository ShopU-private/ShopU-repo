'use client';

import React, { useState, useRef } from 'react';
import ProductCard from './ProductCard';
import { useMedicines } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useRouter } from 'next/navigation';

interface Product {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image?: string;
  imgUrl?: string;
  category: string;
  manufacturerName?: string;
  packSizeLabel?: string;
  subtitle?: string;
}

const BabyCareSection = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addingIds, setAddingIds] = useState<(number | string)[]>([]);
  const { addItem } = useCart();
  const router = useRouter();

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  // Fetch medicine with "baby care" type
  const { medicines, loading, error } = useMedicines({
    type: 'allopathy', // Filter by medicine type
    limit: 10,
  });

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleAddToCart = async (product: Product) => {
    setAddingIds(prev => [...prev, product.id]);
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

  const handleView = () => {
    router.push('/product?category=BabyCare'); //Change path as per your route
  };

  return (
    <section className="mx-auto w-[90%] max-w-7xl px-4 py-6 sm:px-6 lg:px-4">
      {/* Section Header */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="mb-4 text-xl font-semibold text-[#317C80] sm:text-xl">
          Baby <span className="text-[#E93E40]">Care</span>
          <hr className="mt-1 h-1 w-24 rounded border-0 bg-[#317C80]" />{' '}
        </h2>
        <button
          onClick={handleView}
          className="cursor-pointer rounded bg-[#317C80] px-3 py-1 text-sm font-medium text-white"
        >
          View All <span className="text-lg">{'>'}</span>
        </button>
      </div>

      {/* Horizontal Scrollable Card Row */}
      <div className="relative">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute top-1/2 left-[-10px] z-10 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-[#317C80] text-white shadow-md"
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

        {/* Scrollable product list */}
        <div ref={scrollRef} className="no-scrollbar overflow-x-auto">
          <div className="my-2 flex gap-5 px-2 sm:gap-5">
            {medicines.map(medicine => {
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
          className="absolute top-1/2 right-[-10px] z-10 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full bg-[#317C80] text-white shadow-md"
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
    </section>
  );
};

export default BabyCareSection;
