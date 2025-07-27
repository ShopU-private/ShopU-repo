'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import Navroute from '../components/navroute';
import Sidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useBabycare';

const ProductPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'All';

  const { favorites, toggleFavorite } = useWishlist();
  const { addItem } = useCart();

  const { products, loading } = useProducts({
    category: category === 'All' ? undefined : category,
    limit: 100,
  });

  const handleAddToCart = async (productId: string) => {
    setAddingProductId(productId);
    try {
      await addItem(productId, null, 1);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Add to cart failed:', error);
    } finally {
      setAddingProductId(null);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const filteredProducts = products.filter(product =>
    selectedFilters.length > 0 ? selectedFilters.includes(product.category || '') : true
  );

  const productsPerPage = 12;
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const paginatedProducts = filteredProducts.slice(start, end);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <>
      <Navroute />
      <div className="min-h-xl bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl justify-between gap-4 px-10">
          {/* Sidebar */}
          <Sidebar onCategorySelect={handleAddFilter} />

          {/* Main Content */}
          {loading ? (
            <div className="flex min-h-[70vh] items-center justify-center flex-1">
              <div className="text-center">
                <Loader className="mx-auto h-8 w-8 animate-spin text-teal-600" />
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-gray-500 text-center w-full">No products found.</div>
          ) : (
            <main className="space-y-6 flex-1">
              <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="text-md font-semibold">
                  You searched for:{' '}
                  <span className="text-primaryColor text-lg capitalize">{category}</span>
                </div>
                <select className="rounded bg-white py-2 pr-8 pl-4 text-sm shadow outline-none">
                  <option>Default Sorting</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>

              {selectedFilters.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedFilters.map(filter => (
                    <div
                      key={filter}
                      className="flex items-center gap-2 rounded-full bg-white px-4 text-xs text-gray-600"
                    >
                      <span>{filter}</span>
                      <button
                        onClick={() =>
                          setSelectedFilters(prev => prev.filter(f => f !== filter))
                        }
                        className="text-xl text-gray-600"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Product Grid */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map(product => (
                  <div key={product.id} className="max-w-[210px] min-w-[210px]">
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
                          price: product.price,
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
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${currentPage === 1
                        ? 'bg-gray-200 text-gray-400'
                        : 'bg-primaryColor text-white'
                      }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`h-8 w-8 rounded-full text-sm font-medium ${currentPage === page
                            ? 'bg-primaryColor text-white'
                            : 'text-black hover:bg-gray-200'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400'
                        : 'bg-primaryColor text-white'
                      }`}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="pl-6 text-sm text-gray-700">
                  Showing {start + 1}-{Math.min(end, filteredProducts.length)} of{' '}
                  {filteredProducts.length} results
                </div>
              </div>
            </main>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductPage;
