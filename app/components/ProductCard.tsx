import React from 'react';
import { Heart } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  subtitle?: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (product: Product) => void;
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
    <>
      {/* Desktop view */}
      <div className="group flex hidden h-84 flex-col gap-4 overflow-hidden rounded-lg bg-white p-2 shadow-sm transition-all duration-300 hover:shadow-lg sm:block">
        {/* Product Image */}
        <div className="relative h-40 w-full">
          <div>
            <Image
              src={'/pediasure.png'}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="mt-2 px-12 py-6 transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <button
            onClick={() => onToggleFavorite(product)}
            className="absolute top-0 right-2 hidden rounded-full bg-white p-1.5 shadow-md transition-colors group-hover:flex hover:bg-gray-50"
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'fill-current text-red-500' : 'text-gray-400'}`}
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex flex-grow flex-col px-3 py-2">
          <p className="text-xs font-medium text-red-500">
            End In <span className="font-semibold text-[#317C80]">05:02:12</span>
          </p>
          <h3 className="line-clamp-2 min-h-[3rem] text-sm font-medium text-gray-900 transition-colors group-hover:text-teal-600">
            {product.name.length > 40 ? `${product.name.slice(0, 40)}...` : product.name}
          </h3>
          <p className="mb-1 text-xs text-gray-500">tube of 100 ml Gel</p>

          {product.originalPrice && (
            <div>
              <hr className="text-[#D9D9D9]" />
              <p className="text-xs text-gray-500">
                MRP <s>₹{String(product.originalPrice).slice(0, 5)}</s>{' '}
                <span className="font-medium text-green-500">{product.discount}% OFF</span>
              </p>
            </div>
          )}

          {/* Price & Add Button */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="text-primaryColor py-2 text-xl font-bold">₹{product.price}</span>
              </div>
            </div>

            <button
              onClick={() => onAddToCart(product)}
              disabled={isAdding}
              className="bg-background1 hover:bg-background1 hidden cursor-pointer items-center space-x-1 rounded px-3 py-1 text-white transition group-hover:flex"
            >
              {isAdding ? (
                <span className="text-sm">Adding..</span>
              ) : (
                <>
                  <span className="px-2 text-sm">ADD</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className="group flex h-80 flex-col gap-4 overflow-hidden rounded-lg bg-white p-2 shadow-sm transition-all duration-300 hover:shadow-lg sm:hidden">
        {/* Product Image */}
        <div className="relative h-40 w-full">
          <div>
            <Image
              src={'/pediasure.png'} // dynamic image fallback
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="mt-2 px-8 py-4 transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <button
            onClick={() => onToggleFavorite(product)}
            className="absolute top-0 right-2 rounded-full bg-white p-1.5 shadow-md transition-colors hover:bg-gray-50"
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'fill-current text-red-500' : 'text-gray-400'}`}
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex flex-grow flex-col px-3 py-1">
          <p className="text-xs font-medium text-red-500">
            End In <span className="font-semibold text-[#317C80]">05:02:12</span>
          </p>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-gray-900 transition-colors group-hover:text-teal-600 sm:min-h-[3rem]">
            {product.name.length > 40 ? `${product.name.slice(0, 40)}...` : product.name}
          </h3>
          <p className="mb-1 text-xs text-gray-500">tube of 100 ml Gel</p>

          {product.originalPrice && (
            <div>
              <hr className="text-[#D9D9D9]" />
              <p className="text-xs text-gray-500">
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
              className="bg-background1 hover:bg-background1 cursor-pointer items-center space-x-1 rounded px-2 py-0.5 text-white transition"
            >
              {isAdding ? (
                <span className="text-sm">Adding..</span>
              ) : (
                <>
                  <span className="px-2 text-sm">ADD</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
