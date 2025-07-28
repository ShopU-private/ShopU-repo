'use client';

import React, { useState, useRef } from 'react';
import ProductCard from './ProductCard';
import { useCart } from '../hooks/useCart';
import { useRouter } from 'next/navigation';
import { useWishlist } from '../hooks/useWishlist';
import { useProducts } from '../hooks/useBabycare';

const BabyCareSection = () => {
  const [addingProductId, setAddingProductId] = useState<number | string | null>(null);
  const { favorites, toggleFavorite } = useWishlist();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const router = useRouter();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -690 : 690,
        behavior: 'smooth',
      });
    }
  };

  const { products, loading, error } = useProducts({
    category: 'Baby Care',
    limit: 10,
  });

  const handleAddToCart = async (productId: string) => {
    setAddingProductId(productId);
    try {
      await addItem(productId, null, 1);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Add to cart failed:', error);
    } finally {
      setAddingProductId(null);
    }
  };

  const handleCardClick = () => {
    router.push('/product?category=Baby Care');
  };

  return (
    <section className="min-h-xl">
      {/* Desktop view */}
      <div className="mx-auto hidden w-[90%] max-w-7xl px-4 py-6 sm:block lg:px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-primaryColor mb-4 text-xl font-semibold sm:text-xl">
            Baby <span className="text-secondaryColor">Care</span>
            <hr className="bg-background1 mt-1 h-1 w-24 rounded border-0" />
          </h2>

          <button
            onClick={handleCardClick}
            className="cursor-pointer rounded bg-[#317C80] px-3 py-1 text-sm font-medium text-white"
          >
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
                <div key={index} className="min-w-[210px] animate-pulse">
                  <div className="mb-2 h-52 rounded-lg bg-gray-200"></div>
                  <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-secondaryColor py-8 text-center">
              Failed to load baby care products. Please try again.
            </div>
          ) : products.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No baby care products available.</div>
          ) : (
            <div
              ref={scrollRef}
              className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth py-4"
            >
              {products.map(product => (
                <div key={product.id} className="max-w-[210px] min-w-[210px]">
                  <ProductCard
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      discount: product.discount || 20,
                      stock: product.stock,
                      rating: product.rating || 4.5,
                      reviews: product.reviews || 100,
                      image: product.imageUrl || '/product-placeholder.jpg',
                      category: product.category || 'Product',
                      subtitle: product.description,
                    }}
                    isFavorite={favorites.has(product.id)}
                    onToggleFavorite={() =>
                      toggleFavorite({
                        id: product.id,
                        name: product.name,
                        image: product.imageUrl || '/product-placeholder.jpg',
                        category: product.category || 'Product',
                      })
                    }
                    onAddToCart={() => handleAddToCart(product.id)}
                    isAdding={addingProductId === product.id}
                  />
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => scroll('right')}
            className="bg-background1 absolute top-1/2 right-[-10px] z-10 flex h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full text-white shadow-md"
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

      {/* Mobile view */}
      <div className="px-4 py-6 sm:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-primaryColor mb-4 text-lg font-medium">
            Baby <span className="text-secondaryColor">Care</span>
            <hr className="bg-background1 mt-1 w-24 rounded border-2" />
          </h2>

          <button
            onClick={handleCardClick}
            className="bg-background text-md text-primaryColor cursor-pointer rounded px-3 py-1 font-semibold"
          >
            View All <span className="text-lg">{'>'}</span>
          </button>
        </div>

        <div className="no-scrollbar flex gap-2 overflow-x-auto scroll-smooth py-1">
          {loading ? (
            [...Array(2)].map((_, index) => (
              <div key={index} className="min-w-[190px] animate-pulse">
                <div className="mb-2 h-52 rounded-lg bg-gray-200"></div>
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
              </div>
            ))
          ) : error ? (
            <div className="text-secondaryColor py-8 text-center">
              Failed to load baby care products. Please try again.
            </div>
          ) : products.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No baby care products available.</div>
          ) : (
            products.map(product => (
              <div key={product.id} className="max-w-[185px] min-w-[185px] flex-shrink-0">
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    discount: 20,
                    stock: product.stock,
                    rating: product.rating || 4.5,
                    reviews: product.reviews || 100,
                    image: product.imageUrl || '/product-placeholder.jpg',
                    category: product.category || 'Product',
                    subtitle: product.description,
                  }}
                  isFavorite={favorites.has(product.id)}
                  onToggleFavorite={() =>
                    toggleFavorite({
                      id: product.id,
                      name: product.name,
                      image: product.imageUrl || '/product-placeholder.jpg',
                      category: product.category || 'Product',
                    })
                  }
                  onAddToCart={() => handleAddToCart(product.id)}
                  isAdding={addingProductId === product.id}
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
