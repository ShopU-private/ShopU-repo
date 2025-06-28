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

const personalCareProducts: Product[] = [
  {
    id: 1,
    name: 'Dignity Spongee Soft and Smooth Baby..',
    price: 130,
    originalPrice: 260,
    discount: 50,
    rating: 4.2,
    reviews: 22,
    image: '/products/dignity.jpg',
    category: 'Personal Care',
  },
  {
    id: 2,
    name: "Himalaya Baby Powder | Keeps Baby's Skin..",
    price: 165,
    originalPrice: 89,
    discount: 42,
    rating: 4.4,
    reviews: 51,
    image: '/products/himalaya.jpg',
    category: 'Personal Care',
  },
  {
    id: 3,
    name: 'Sebamed Baby Cleansing Bar|pH 5.5 |Newborn',
    price: 125,
    originalPrice: 165,
    discount: 24,
    rating: 4.6,
    reviews: 19,
    image: '/products/sebamed.jpg',
    category: 'Personal Care',
  },
  {
    id: 4,
    name: 'Econorm 250mg Probiotic Sachet for Children | For..',
    price: 51,
    originalPrice: 96,
    discount: 47,
    rating: 4.3,
    reviews: 30,
    image: '/products/econorm.jpg',
    category: 'Personal Care',
  },
  {
    id: 5,
    name: 'Vicks BabyRub Balm | For 3 Months & Above',
    price: 194,
    originalPrice: 225,
    discount: 13,
    rating: 4.7,
    reviews: 43,
    image: '/products/vicks.jpg',
    category: 'Personal Care',
  },
];

const PersonalCareSection = () => {
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
            Personal <span className="text-gray-500">Care</span>
          </h2>
          <button className="text-sm text-teal-600 hover:underline font-medium">View All</button>
        </div>

        <div className="flex overflow-x-auto gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible pb-2">
          {personalCareProducts.map((product) => (
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

export default PersonalCareSection;
