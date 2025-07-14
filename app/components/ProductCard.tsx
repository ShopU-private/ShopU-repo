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
    <div className="group flex h-88 flex-col gap-4 overflow-hidden rounded-lg bg-white p-2 shadow-sm transition-all duration-300 hover:shadow-lg sm:h-88">
      {/* Product Image */}
      <div className="relative h-32 w-full sm:h-40">
        <Image
          src="/Nivea.png"
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover px-12 pt-8 pb-2 transition-transform duration-300 group-hover:scale-105"
        />
        {product.discount && (
          <div className="absolute top-2 left-2 rounded bg-red-600 px-1.5 py-0.5 text-xs font-medium text-white">
            {product.discount}% OFF
          </div>
        )}
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-0.5 right-2 rounded-full bg-white p-1.5 shadow-md transition-colors hover:bg-gray-50"
        >
          <Heart
            className={`h-5 w-3 sm:h-5 sm:w-5 ${
              isFavorite ? 'fill-current text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-grow flex-col p-2 sm:p-3">
        <p className="text-xs font-medium text-red-500">
          End In <span className="font-semibold text-[#317C80]">05:02:12</span>
        </p>
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-gray-900 transition-colors group-hover:text-teal-600 sm:mb-1 sm:min-h-[3rem]">
          {product.name.length > 40 ? `${product.name.slice(0, 40)}...` : product.name}
        </h3>
        <p className="mb-1 text-xs text-gray-500">tube of 100 ml Gel</p>

        {product.originalPrice && (
          <div>
            <hr className="text-[#D9D9D9]" />
            <p className="text-sm text-gray-500">
              MRP <s>₹{String(product.originalPrice).slice(0, 5)}</s>{' '}
              <span className="font-medium text-green-500">{product.discount}% OFF</span>
            </p>
          </div>
        )}

        {/* Price & Add Button */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <span className="text-primaryColor py-2 text-xl font-bold sm:text-xl">
                ₹{product.price}
              </span>
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isAdding}
            className="bg-background1 hover:bg-background1 flex hidden items-center space-x-1 rounded-lg px-3 py-1.5 text-white transition group-hover:flex sm:px-4 sm:py-2"
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
