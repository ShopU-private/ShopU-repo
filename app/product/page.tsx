'use client';

import React, { useState, Suspense } from 'react';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import Navroute from '../components/navroute';
import Sidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../hooks/useWishlist';
import { useProducts } from '../hooks/useBabycare';
import useAddToCart from '../hooks/handleAddToCart';

// Create a separate component that uses useSearchParams
function ProductPageContent() {
  const [currentPage, setCurrentPage] = useState(1);
  // Removed unused selectedFilters state
  const { handleAddToCart, addingProductId } = useAddToCart();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'All';

  const { favorites, toggleFavorite } = useWishlist();

  const { products, loading } = useProducts({
    category: category === 'All' ? undefined : category,
    limit: 100,
  });

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const itemsPerPage = 20;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navroute />
      <div className="container mx-auto flex gap-6 px-4 py-6">
        <aside className="w-64 flex-shrink-0">
          <Sidebar
            onCategorySelect={(category) => {
              // Handle category selection
              console.log('Selected category:', category);
            }}
          />
        </aside>

        <div className="flex-1">
          {loading ? (
            <div className="flex min-h-[70vh] flex-1 items-center justify-center">
              <div className="text-center">
                <Loader className="mx-auto h-8 w-8 animate-spin text-teal-600" />
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="w-full text-center text-gray-500">No products found.</div>
          ) : (
            <main className="flex-1 space-y-6">
              <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="text-md font-semibold">
                  You searched for:{' '}
                  <span className="text-primaryColor text-lg capitalize">{category}</span>
                </div>
                <select className="rounded bg-white py-2 pr-8 pl-4 text-sm shadow outline-none">
                  <option>Default Sorting</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating: High to Low</option>
                </select>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {currentProducts.map(product => (
                  <div key={product.id} className="flex justify-center">
                    <ProductCard
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        discount: product.discount || 20,
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
                          image: product.imageUrl || '/product-placeholder.jpg',
                          category: product.category || 'Product',
                        })
                      }
                      onAddToCart={() => handleAddToCart(product.id)}
                      isAdding={addingProductId === product.id}
                    />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex items-center justify-around">
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      currentPage === 1
                        ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      currentPage === totalPages
                        ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}

// Main component wrapped with Suspense
const ProductPage = () => {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader className="mx-auto h-8 w-8 animate-spin text-teal-600" />
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductPageContent />
    </Suspense>
  );
};

export default ProductPage;
