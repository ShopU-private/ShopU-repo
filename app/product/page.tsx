'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../components/ProductView-Card';
import { ProductType } from '../types/ProductTypes';
import FilterSidebar from '../components/FilterSidebar';
import { X } from 'lucide-react';

const PRODUCTS_PER_PAGE = 16;

const Page = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filtered, setFiltered] = useState<ProductType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [sort, setSort] = useState('');
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  useEffect(() => {
    axios.get(`/product?category=${category}`).then(res => {
      setProducts(res.data);
      setFiltered(res.data);
    });
  }, [category]);

  const sortedData = () => {
    let data = [...filtered];
    if (sort === 'low-to-high') {
      data.sort((a, b) => a.price - b.price);
    } else if (sort === 'high-to-low') {
      data.sort((a, b) => b.price - a.price);
    }
    return data;
  };

  const paginated = sortedData().slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const MAX_PAGES = 10;
  const totalPages = Math.min(Math.ceil(filtered.length / PRODUCTS_PER_PAGE), MAX_PAGES);

  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }) => {
    const getPages = () => {
      const pages = [];
      if (totalPages <= 2) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (currentPage <= 4) {
          pages.push(1, 2, 3, 4, 5, '...', totalPages);
        } else if (currentPage >= totalPages - 3) {
          pages.push(
            1,
            '...',
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages
          );
        } else {
          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
      }
      return pages;
    };

    return (
      <div className="mt-6 flex justify-center gap-4">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          &#8592; Prev
        </button>

        {getPages().map((page, index) =>
          page === '...' ? (
            <span key={index} className="px-2">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(Number(page))}
              className={`h-8 w-8 rounded-full border text-sm font-medium ${
                currentPage === page
                  ? 'bg-[#317C80] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded border px-3 py-1 disabled:opacity-50"
        >
          Next &#8594;
        </button>
      </div>
    );
  };

  return (
    <div className="container mx-auto max-w-7xl p-4 md:p-6">
      <div className="flex flex-col md:flex-row">
        {/* === Sidebar === */}
        <div className="mt-14 mb-4 w-full md:mb-0 md:w-1/4 md:pr-6">
          <div className="rounded bg-white p-4 shadow-sm">
            {/* Price Range */}
            <div className="mb-4">
              <label className="mb-1 block text-lg font-medium">Price Range</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-20 rounded border px-2 py-1 text-lg"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="w-20 rounded border px-2 py-1 text-lg"
                />
                <button className="rounded bg-[#317C80] px-2 py-1 text-lg text-white">Go</button>
              </div>
            </div>

            {/* Filter Sidebar */}
            <FilterSidebar
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
            />
          </div>
        </div>

        {/* === Product Section === */}
        <div className="w-full md:w-3/4">
          <div className="mb-4">
            <p className="font-bold text-gray-600">
              You searched for: <b>{category}</b>
            </p>

            {/* SHOW SELECTED FILTERS BELOW */}
            {selectedFilters.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedFilters.map(filter => (
                  <span
                    key={filter}
                    className="flex items-center rounded-full bg-blue-100 px-2 py-1 text-sm text-[#317c80]"
                  >
                    {filter}
                    <X
                      className="ml-1 h-4 w-4 cursor-pointer"
                      onClick={() =>
                        setSelectedFilters(prev => prev.filter(item => item !== filter))
                      }
                    />
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sorting */}
          <div className="mb-4 flex justify-end">
            <select
              className="rounded border px-4 py-2 text-lg"
              onChange={e => setSort(e.target.value)}
            >
              <option value="">Default Sorting</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {paginated.map(item => (
              <ProductCard key={item._id} item={item} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
