'use client';

import React, { useState, useRef } from 'react';
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
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addingIds, setAddingIds] = useState<(number | string)[]>([]);
  const { addItem } = useCart();

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  // Fetch medicine with "baby care" type
  const { medicines, loading, error } = useMedicines({
    type: 'allopathy', // Filter by medicine type
    limit: 10,
  });

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = async (product: Product) => {
    setAddingIds((prev) => [...prev, product.id]);
    try {
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
    <section className="px-4 sm:px-6 lg:px-4 py-6 max-w-7xl mx-auto w-[90%] ">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl sm:text-xl font-semibold text-[#317C80] mb-4">Baby <span className="text-[#E93E40]">Care</span><hr className="bg-[#317C80] w-24 h-1 border-0 rounded mt-1" /> </h2>
        <button className="text-sm font-medium bg-[#317C80] text-white py-1 px-3 rounded cursor-pointer">
          View All <span className="text-lg">{'>'}</span>
        </button>
      </div>

      {/* Horizontal Scrollable Card Row */}
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
      </div>

    </section>
  );
};

export default BabyCareSection;