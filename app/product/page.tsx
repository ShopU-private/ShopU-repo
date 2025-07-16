'use client';

import React, { useRef, useState } from 'react';
import Sidebar from '../components/FilterSidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useMedicines } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Navroute from '../components/navroute';

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  const [addingProductId, setAddingProductId] = useState<number | string | null>(null);
  const { favorites, toggleFavorite } = useWishlist();
  const { addItem } = useCart();

  const { medicines, loading, error } = useMedicines({
    type: 'allopathy',
    limit: 16,
  });

  const handleAddToCart = async (medicineId: string) => {
    setAddingProductId(medicineId);
    try {
      await addItem(null, medicineId, 1);
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
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleAddFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  return (
    <>
      <Navroute />
      <div className="min-h-xl bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl justify-between gap-4 px-12">
          {/* Sidebar */}
          <Sidebar onCategorySelect={handleAddFilter} />

          {/* Main Content */}
          <main className="space-y-6 lg:col-span-4">
            {/* Top Filter Bar */}
            <div className="mb-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="text-md font-semibold">
                You searched for* <span className="text-primaryColor">Baby Care</span>
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
                      onClick={() => setSelectedFilters(prev => prev.filter(f => f !== filter))}
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
              {medicines.map(medicine => (
                <div key={medicine.id} className="max-w-[210px] min-w-[210px]">
                  <ProductCard
                    product={{
                      id: medicine.id,
                      name: `${medicine.name} ${medicine.packSizeLabel ? `(${medicine.packSizeLabel})` : ''}`,
                      price: medicine.price,
                      originalPrice: medicine.originalPrice || medicine.price * 1.2,
                      discount: medicine.discount || 20,
                      rating: medicine.rating || 4.5,
                      reviews: medicine.reviews || 100,
                      image: medicine.imageUrl || '/medicine-placeholder.jpg',
                      category: medicine.type || 'Medicine',
                      subtitle: medicine.manufacturerName,
                    }}
                    isFavorite={favorites.has(medicine.id)}
                    onToggleFavorite={() =>
                      toggleFavorite({
                        id: medicine.id,
                        name: `${medicine.name} ${medicine.packSizeLabel ? `(${medicine.packSizeLabel})` : ''}`,
                        price: medicine.price,
                        image: medicine.imageUrl || '/medicine-placeholder.jpg',
                        category: medicine.type || 'Medicine',
                      })
                    }
                    onAddToCart={() => handleAddToCart(medicine.id)}
                    isAdding={addingProductId === medicine.id}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-around">
              {/* Page Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-primaryColor text-white'
                  }`}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {[1, 2, 3].map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`h-8 w-8 rounded-full text-sm font-medium ${
                      currentPage === page
                        ? 'bg-primaryColor text-white'
                        : 'text-black hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <span className="text-lg">...</span>

                {/* Next Button */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="bg-primaryColor flex h-8 w-8 items-center justify-center rounded-full text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Results Info */}
              <div className="pl-24 text-sm text-gray-700">
                Showing {(currentPage - 1) * 2 + 1}-{currentPage * 2} of 27 results
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Page;
