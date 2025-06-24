import React, { useState, useEffect } from 'react';
import { Plus, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

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

interface HealthCategory {
  id: string;
  name: string;
  icon: string;
}

const ShopUHealthComponent: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [visibleCards, setVisibleCards] = useState(1);

  const healthCategories: HealthCategory[] = [
    { id: 'diabetes', name: 'Diabetes Care', icon: '🩺' },
    { id: 'cardiac', name: 'Cardiac Care', icon: '❤️' },
    { id: 'elderly', name: 'Elderly Care', icon: '👴' },
    { id: 'oral', name: 'Oral Care', icon: '🦷' },
    { id: 'stomach', name: 'Stomach Care', icon: '🫁' },
    { id: 'pain', name: 'Pain Relief', icon: '💊' },
    { id: 'liver', name: 'Liver Care', icon: '🫀' },
  ];

  const products: Product[] = [
    {
      id: 1,
      name: 'Cofsils Gargle (Buy 1 Get 1 FREE)',
      price: 130,
      originalPrice: 260,
      discount: 50,
      rating: 4.5,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop',
      category: 'Oral Care',
    },
    {
      id: 2,
      name: 'She Need Hair Supplement with Folic Acid',
      price: 165,
      originalPrice: 275,
      discount: 40,
      rating: 4.3,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
      category: 'Hair Care',
    },
    {
      id: 3,
      name: 'Easylax L Oral Solution Lemon Sugar Free',
      price: 125,
      originalPrice: 165,
      discount: 24,
      rating: 4.2,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop',
      category: 'Digestive Health',
    },
    {
      id: 4,
      name: 'Combo Pack of Tata 1mg Pain Relief Spray',
      price: 51,
      originalPrice: 88,
      discount: 46,
      rating: 4.6,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop',
      category: 'Pain Relief',
    },
    {
      id: 5,
      name: 'Prega News Advance Pregnancy Rapid Test Kit',
      price: 194,
      originalPrice: 225,
      discount: 20,
      rating: 4.8,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=300&h=300&fit=crop',
      category: 'Women\'s Health',
    },
  ];

  const toggleFavorite = (productId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1); // Mobile: 1 card
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2); // Tablet: 2 cards
      } else if (window.innerWidth < 1280) {
        setVisibleCards(3); // Desktop: 3 cards
      } else {
        setVisibleCards(4); // Large Desktop: 4 cards
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const maxSlides = Math.max(0, products.length - visibleCards);
      return prev >= maxSlides ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      const maxSlides = Math.max(0, products.length - visibleCards);
      return prev <= 0 ? maxSlides : prev - 1;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Health Categories */}
        <section className="mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Shop By Health Concerns</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
            {healthCategories.map((category) => (
              <button
                key={category.id}
                className="bg-white p-2 sm:p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border hover:border-teal-200 group"
              >
                <div className="text-xl sm:text-2xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                  {category.name}
                </h3>
              </button>
            ))}
          </div>
        </section>

        {/* Super Saver Section */}
        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Super Saver</h2>
              <p className="text-sm sm:text-base text-gray-600">Up to 50% off</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={prevSlide}
                className="p-1.5 sm:p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-1.5 sm:p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${(currentSlide * 100) / visibleCards}%)` }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`flex-shrink-0 px-1 sm:px-2`}
                  style={{ width: `${100 / visibleCards}%` }}
                >
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col h-full">
                    {/* Product Image */}
                    <div className="relative w-full h-32 sm:h-40">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.discount && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                          {product.discount}% OFF
                        </div>
                      )}
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                      >
                        <Heart
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            favorites.has(product.id)
                              ? 'text-red-500 fill-current'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-2 sm:p-3 flex flex-col flex-grow">
                      <div className="mb-1 sm:mb-2">
                        <span className="text-xs text-teal-600 font-medium bg-teal-50 px-1.5 py-0.5 rounded">
                          {product.category}
                        </span>
                      </div>
                      <h3 className="font-medium text-sm sm:text-base text-gray-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors min-h-[2.5rem] sm:min-h-[3rem]">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center space-x-1 mb-2 sm:mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      {/* Price and Add Button Side by Side */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <span className="text-base sm:text-lg font-bold text-gray-900">
                              ₹{product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs sm:text-sm text-gray-500 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                          <button className="bg-teal-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-1 group">
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform" />
                            <span className="text-xs sm:text-sm">ADD</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
  );
};

export default ShopUHealthComponent;