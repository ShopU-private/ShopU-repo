import React from 'react';
import { Heart, Plus, Star } from 'lucide-react';
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

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (productId: number) => void;
  onAddToCart: (product: Product) => void;
  isAdding: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  isAdding,
}) => {
  return (
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
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Heart
            className={`w-3 h-3 sm:w-4 sm:h-4 ${
              isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
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

        {/* Price & Add Button */}
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

          <button
            onClick={() => onAddToCart(product)}
            disabled={isAdding}
            className="bg-teal-600 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-1 group"
          >
            {isAdding ? (
              <span>Adding...</span>
            ) : (
              <>
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform" />
                <span className="text-xs sm:text-sm">ADD</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
