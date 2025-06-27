import React, { useState } from 'react';
import ProductCard from './ProductCard'; // adjust if needed

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

const products: Product[] = [
  {
    id: 1,
    name: 'Dignity Spongee Soft and Smooth Baby Wipes',
    price: 130,
    originalPrice: 260,
  
    rating: 4.2,
    reviews: 85,
    image: '/placeholder-image.png',
    category: 'Baby Care',
  },
  {
    id: 9,
    name: 'Dignity Spongee Soft and Smooth Baby Wipes',
    price: 130,
    originalPrice: 260,
  
    rating: 4.2,
    reviews: 85,
    image: '/placeholder-image.png',
    category: 'Baby Care',
  },
  {
    id: 12,
    name: 'Dignity Spongee Soft and Smooth Baby Wipes',
    price: 130,
    originalPrice: 260,
   
    rating: 4.2,
    reviews: 85,
    image: '/placeholder-image.png',
    category: 'Baby Care',
  },
  {
    id: 2,
    name: 'Himalaya Baby Powder | Keeps Baby’s Skin Soft',
    price: 165,
    originalPrice: 275,
  
    rating: 4.5,
    reviews: 132,
    image: '/placeholder-image.png',
    category: 'Baby Care',
  },
  {
    id: 3,
    name: 'Sebamed Baby Cleansing Bar | pH 5.5 | Newborn',
    price: 125,
    originalPrice: 165,

    rating: 4.1,
    reviews: 76,
    image: '/placeholder-image.png',
    category: 'Baby Care',
  },
  {
    id: 4,
    name: 'Econorm 250mg Probiotic Sachet for Children',
    price: 51,
    originalPrice: 96,
 
    rating: 4.3,
    reviews: 58,
    image: '/placeholder-image.png',
    category: 'Baby Care',
  },
  {
    id: 5,
    name: 'Vicks BabyRub Balm | For 3 Months & Above',
    price: 194,
    originalPrice: 225,
 
    rating: 4.6,
    reviews: 112,
    image: '/placeholder-image.png',
    category: 'Baby Care',
  },
];

const BabyCareSection = () => {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
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
    await new Promise((res) => setTimeout(res, 600)); // simulate API
    setAddingProductId(null);
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Section Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b-4 border-[var(--shopu-color,#008080)] pb-1">
          Baby <span className="text-[var(--shopu-color,#008080)]">Care</span>
        </h2>
        <button className="text-sm font-medium text-[var(--shopu-color,#008080)] hover:underline flex items-center gap-1">
          View All <span className="text-lg">{'>'}</span>
        </button>
      </div>

      {/* Horizontal Scrollable Card Row */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 sm:gap-4">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-[160px] sm:w-[180px] md:w-[200px]">
              <ProductCard
                product={product}
                isFavorite={favorites.has(product.id)}
                onToggleFavorite={toggleFavorite}
                onAddToCart={handleAddToCart}
                isAdding={addingProductId === product.id}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BabyCareSection;
