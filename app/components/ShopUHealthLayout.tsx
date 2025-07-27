'use client';

import React, { useState, useRef } from 'react';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/ProductCard';
import HealthCategoryGrid from '../components/HealthCategoryGrid';

import { useWishlist } from '../hooks/useWishlist';
import { useProducts } from '../hooks/useBabycare';

interface HealthCategory {
  id: string;
  name: string;
  image: string;
}

const ShopUHealthComponent: React.FC = () => {
  const [addingProductId, setAddingProductId] = useState<number | string | null>(null);
  const { favorites, toggleFavorite } = useWishlist();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  const { products, loading, error } = useProducts({
    category: 'Women Care',
    limit: 10,
  });

  const healthCategories: HealthCategory[] = [
    { id: 'diabetes', name: 'Diabetes Care', image: '/Diabetise.jpg' },
    { id: 'cardiac', name: 'Cardiac Care', image: '/cardiac.jpg' },
    { id: 'elderly', name: 'Elderly Care', image: '/elderly.jpg' },
    { id: 'oral', name: 'Oral Care', image: '/oral.jpg' },
    { id: 'stomach', name: 'Stomach Care', image: '/stomach.jpg' },
    { id: 'pain', name: 'Pain Relief', image: '/pain.jpg' },
    { id: 'liver', name: 'Liver Care', image: '/liver.jpg' },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -690 : 690,
        behavior: 'smooth',
      });
    }
  };

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

  return (
    <section className="min-h-xl">
      {/* ✅ Desktop View */}
      <div className="mx-auto hidden w-[90%] max-w-7xl px-4 py-6 sm:block">
        {/* ✅ Health Categories */}
        <HealthCategoryGrid healthCategories={healthCategories} />

        {/* ✅ Super Saver Section */}
        <div className="mx-auto py-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-primaryColor text-xl font-semibold">
              Super Saver <span className="text-secondaryColor">Up to 50% off</span>
              <hr className="bg-background1 mt-1 h-1 rounded border-0" />
            </h2>
            <button className="bg-background1 cursor-pointer rounded px-3 py-1 text-sm font-medium text-white">
              View All <span className="text-lg">{'>'}</span>
            </button>
          </div>

          <div className="relative">
            {/* Scroll Arrows */}
            <button
              onClick={() => scroll('left')}
              className="bg-background1 absolute top-1/2 left-[-15px] z-10 hidden h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full text-white shadow-md sm:flex"
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

            <div
              ref={scrollRef}
              className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth py-4"
            >
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <div key={index} className="min-w-[210px] animate-pulse">
                    <div className="mb-2 h-52 rounded-lg bg-gray-200"></div>
                    <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                    <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                  </div>
                ))
              ) : error ? (
                <div className="text-secondaryColor py-8 text-center">
                  Failed to load medicines. Please try again.
                </div>
              ) : products.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No medicines available.</div>
              ) : (
                products.map(product => (
                  <div key={product.id} className="max-w-[210px] min-w-[210px] flex-shrink-0">
                  <ProductCard
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      originalPrice: product.originalPrice,
                      discount: product.discount,
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
                        price: product.price,
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

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              className="bg-background1 absolute top-1/2 right-[-10px] z-10 hidden h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full text-white shadow-md sm:flex"
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
      </div>

      {/* ✅ Mobile View */}
      <div className="px-4 py-4 sm:hidden">
        <HealthCategoryGrid healthCategories={healthCategories} />

        <div className="py-4">
          <div className="my-4 flex items-center justify-between">
            <h2 className="text-primaryColor text-lg font-medium">
              Super Saver <span className="text-secondaryColor">Up to 50% off</span>
              <hr className="bg-background1 mt-1 rounded border-2" />
            </h2>
            <button className="bg-background text-md text-primaryColor cursor-pointer rounded px-3 py-1 font-semibold">
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
                Failed to load medicines. Please try again.
              </div>
            ) : products.length === 0 ? (
              <div className="py-8 text-center text-gray-500">No medicines available.</div>
            ) : (
              products.map(product => (
                <div key={product.id} className="max-w-[185px] min-w-[185px] flex-shrink-0">
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    discount: product.discount,
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
                      price: product.price,
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
      </div>
    </section>
  );
};

export default ShopUHealthComponent;
