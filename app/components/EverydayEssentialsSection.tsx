'use client';

import React, { useState } from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
}

const everydayEssentials: Product[] = [
  {
    id: 1,
    name: 'Ultra-Dry Baby Diaper Pants | Superior Leak ...',
    price: 130,
    originalPrice: 260,
    discount: 50,
    rating: 4.3,
    reviews: 40,
    image: '/products/diaper.jpg',
    category: 'Everyday Essentials',
  },
  {
    id: 2,
    name: 'Novology Gentle Face Cleanser Non-Foaming...',
    price: 165,
    originalPrice: 89,
    discount: 42,
    rating: 4.1,
    reviews: 33,
    image: '/products/facecleanser.jpg',
    category: 'Everyday Essentials',
  },
  {
    id: 3,
    name: 'Zandu StriVeda Satavari Lactation Supplement',
    price: 125,
    originalPrice: 165,
    discount: 24,
    rating: 4.5,
    reviews: 22,
    image: '/products/zandu.jpg',
    category: 'Everyday Essentials',
  },
  {
    id: 4,
    name: 'Himalaya Erina-EP Powder (For Pets)',
    price: 51,
    originalPrice: 96,
    discount: 47,
    rating: 4.6,
    reviews: 18,
    image: '/products/erina.jpg',
    category: 'Everyday Essentials',
  },
  {
    id: 5,
    name: 'Dignity Magna Adult Unisex Diaper | Size XL',
    price: 194,
    originalPrice: 225,
    discount: 13,
    rating: 4.2,
    reviews: 29,
    image: '/products/magna.jpg',
    category: 'Everyday Essentials',
  },
];

const EverydayEssentialsSection = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addingIds, setAddingIds] = useState<number[]>([]);

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const addToCart = (product: Product) => {
    setAddingIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddingIds((prev) => prev.filter((id) => id !== product.id));
      alert(`${product.name} added to cart!`);
    }, 1000);
  };

  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Everyday <span className="text-gray-500">Essentials</span>
          </h2>
          <button className="text-sm text-teal-600 hover:underline font-medium">View All</button>
        </div>

        {/* Responsive layout */}
        <div className="flex overflow-x-auto gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible pb-2">
          {everydayEssentials.map((product) => (
            <div key={product.id} className="min-w-[180px] sm:min-w-0">
              <ProductCard
                product={product}
                isFavorite={favorites.includes(product.id)}
                onToggleFavorite={toggleFavorite}
                onAddToCart={addToCart}
                isAdding={addingIds.includes(product.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EverydayEssentialsSection;
