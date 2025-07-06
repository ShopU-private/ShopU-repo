'use client';

import React, { useState } from 'react';
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
  const { addItem } = useCart();

  // Fetch women's care medicines using the existing API
  const { medicines, loading, error } = useMedicines({
    type: 'Women Care', // Filter by medicine type
    limit: 5,
  });

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleAddToCart = async (product: Product) => {
    setAddingIds(prev => [...prev, product.id]);

    try {
      // Use medicineId parameter for medicines
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
        </div>
      </div>
    </section>
  );
};

export default WomenCareSection;
