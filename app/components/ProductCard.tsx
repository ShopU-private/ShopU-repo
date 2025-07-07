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
    <div className="group flex h-full flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Product Image */}
      <div className="relative h-32 w-full sm:h-40">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.discount && (
          <div className="absolute top-2 left-2 rounded bg-red-600 px-1.5 py-0.5 text-xs font-medium text-white">
            {product.discount}% OFF
          </div>
        )}
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-2 right-2 rounded-full bg-white p-1.5 shadow-md transition-colors hover:bg-gray-50"
        >
          <Heart
<<<<<<< HEAD
            className={`h-3 w-3 sm:h-4 sm:w-4 ${
              isFavorite ? 'fill-current text-red-500' : 'text-gray-400'
            }`}
=======
            className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'
              }`}
>>>>>>> f6a1dc91063cebddc87d89c36f350f5a8279f26f
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-grow flex-col p-2 sm:p-3">
        <div className="mb-1 sm:mb-2">
          <span className="rounded bg-teal-50 px-1.5 py-0.5 text-xs font-medium text-teal-600">
            {product.category}
          </span>
        </div>
        <h3 className="mb-1 line-clamp-2 min-h-[2.5rem] text-sm font-medium text-gray-900 transition-colors group-hover:text-teal-600 sm:mb-2 sm:min-h-[3rem] sm:text-base">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mb-2 flex items-center space-x-1 sm:mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
<<<<<<< HEAD
                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                  i < Math.floor(product.rating) ? 'fill-current text-yellow-400' : 'text-gray-300'
                }`}
=======
                className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                  }`}
>>>>>>> f6a1dc91063cebddc87d89c36f350f5a8279f26f
              />
            ))}
          </div>
          <span className="text-xs text-gray-600 sm:text-sm">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price & Add Button */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-base font-bold text-gray-900 sm:text-lg">₹{product.price}</span>
              {product.originalPrice && (
<<<<<<< HEAD
                <span className="text-xs text-gray-500 line-through sm:text-sm">
                  ₹{product.originalPrice}
=======
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ₹{String(product.originalPrice).slice(0, 5)}
>>>>>>> f6a1dc91063cebddc87d89c36f350f5a8279f26f
                </span>

              )}
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isAdding}
<<<<<<< HEAD
            className="group flex items-center space-x-1 rounded-lg bg-teal-600 px-3 py-1.5 text-white transition-colors hover:bg-teal-700 sm:px-4 sm:py-2"
=======
            className="bg-[#317C80] text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg hover:bg-teal-700 transition-colors flex items-center space-x-1 group"
>>>>>>> f6a1dc91063cebddc87d89c36f350f5a8279f26f
          >
            {isAdding ? (
              <span>Adding...</span>
            ) : (
              <>
                <Plus className="h-3 w-3 transition-transform group-hover:rotate-90 sm:h-4 sm:w-4" />
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
