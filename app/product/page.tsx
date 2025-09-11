import React from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, SlidersVertical } from 'lucide-react';
import Navroute from '../components/navroute';
import Sidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProduct';
import { useWishlist } from '../hooks/useWishlist';

export default function ProductPage({ searchParams }: { searchParams: Record<string, string> }) {
  const category = searchParams?.category || 'All';
  const products = useProducts({
    category: category === 'All' ? undefined : category,
    limit: 100,
  });
  const favorites = useWishlist();

  const productsPerPage = 20;
  const currentPage = Number(searchParams?.page) || 1;
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const paginatedProducts = products.products.slice(start, end);
  const totalPages = Math.ceil(products.products.length / productsPerPage);

  return (
    <>
      <Navroute />
      {products.products.length === 0 ? (
        <div className="min-h-[70vh] pt-4 text-center text-gray-500">No products found.</div>
      ) : (
        <div className="min-h-xl bg-background p-4 md:px-2 lg:px-8">
          <div className="mx-auto flex max-w-7xl justify-between gap-6 px-6 py-4 sm:flex md:px-6 lg:px-10">
            <>
              <Sidebar
                onCategorySelect={() => { }}
                onPriceFilter={() => { }}
              />

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
                  </select>
                </div>

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
                        isFavorite={favorites.favorites.has(product.id)}
                        onToggleFavorite={() => { }}
                        onAddToCart={() => { }}
                        isAdding={false}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-around">
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${currentPage === 1
                          ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                          : 'bg-background1 text-white'
                        }`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      disabled={currentPage === totalPages}
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${currentPage === totalPages
                          ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                          : 'bg-background1 text-white'
                        }`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-700">
                    Showing {start + 1}-{Math.min(end, products.products.length)} of {products.products.length} results
                  </div>
                </div>
              </main>
            </>
          </div>

          <div className="flex justify-between sm:hidden">
            <>
              <main className="flex-1 space-y-2">
                <div className="text-md mb-4 items-end justify-between">
                  <div className="mb-2 px-2 font-semibold">
                    You searched for:{' '}
                    <span className="text-primaryColor text-lg capitalize">{category}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <button
                        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2"
                      >
                        <SlidersVertical size={20} className="text-primaryColor" />
                        Filter
                      </button>
                      <Sidebar
                        onCategorySelect={() => { }}
                        onPriceFilter={() => { }}
                        isOpen={false}
                        onClose={() => { }}
                      />

                      <button className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-2">
                        Sort By <ChevronDown size={24} className="text-primaryColor" />
                      </button>
                    </div>
                    <div className="text-xs">
                      Showing {start + 1}-{Math.min(end, products.products.length)} of {products.products.length} results
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {paginatedProducts.map(product => (
                    <div key={product.id} className="max-w-[185px] min-w-[185px]">
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
                        isFavorite={favorites.favorites.has(product.id)}
                        onToggleFavorite={() => { }}
                        onAddToCart={() => { }}
                        isAdding={false}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-around">
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${currentPage === 1
                          ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                          : 'bg-background1 text-white'
                        }`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      disabled={currentPage === totalPages}
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${currentPage === totalPages
                          ? 'cursor-not-allowed bg-gray-200 text-gray-400'
                          : 'bg-background1 text-white'
                        }`}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </main>
            </>
          </div>
        </div>
      )}
    </>
  );
}