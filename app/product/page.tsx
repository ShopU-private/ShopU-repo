'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../components/ProductView-Card';
import FilterSection from '../components/ProductFilter';
import { ProductType } from '../types/ProductTypes';

const PRODUCTS_PER_PAGE = 16; // Each page will show 12 products

const Page = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filtered, setFiltered] = useState<ProductType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    brand: [] as string[],
    skinType: [] as string[],
  });
  const [sort, setSort] = useState('');

  const searchParams = useSearchParams();
  const category = searchParams.get('category'); //

  // Fetch products from backend when category changes
  useEffect(() => {
    axios.get(`/product?category=${category}`).then(res => {
      setProducts(res.data); // full list of products
      setFiltered(res.data); // initially, filtered list is same
    });
  }, [category]);

  //  Handle brand/skinType checkbox filters
  const handleFilterChange = (type: string, value: string) => {
    const updated = { ...filters };
    const list = updated[type as keyof typeof filters];

    updated[type as keyof typeof filters] = list.includes(value)
      ? list.filter(v => v !== value)
      : [...list, value];

    setFilters(updated);

    //  Apply filters to products
    let data = [...products];
    Object.keys(updated).forEach(key => {
      const values = updated[key as keyof typeof filters];
      if (values.length > 0) {
        data = data.filter(p => values.includes(p[key as keyof ProductType] as string));
      }
    });

    setFiltered(data);
    setCurrentPage(1); // reset to page 1
  };

  //  Apply sorting (Low-High or High-Low)
  const sortedData = () => {
    let data = [...filtered];
    if (sort === 'low-to-high') {
      data.sort((a, b) => a.price - b.price);
    } else if (sort === 'high-to-low') {
      data.sort((a, b) => b.price - a.price);
    }
    return data;
  };

  //  Paginate the filtered and sorted data
  const paginated = sortedData().slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const MAX_PAGES = 10;
  const totalPages = Math.min(Math.ceil(filtered.length/PRODUCTS_PER_PAGE), MAX_PAGES);

  // pagination UI
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
      <div className="flex justify-center mt-6 gap-4">
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
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row">
        {/* === Sidebar: Filters === */}
        <div className="mt-14 mb-4 w-full md:mb-0 md:w-1/4 md:pr-6">
  <div className="rounded border bg-white p-4 shadow-sm">
    {/* Price Range */}
    <div className="mb-4">
      <label className="block text-lg font-medium mb-1">Price Range</label>
      <div className="flex items-center gap-2">
        <input type="number" placeholder="Min" className="border px-2 py-1 w-20 rounded text-lg" />
        <span>-</span>
        <input type="number" placeholder="Max" className="border px-2 py-1 w-20 rounded text-lg" />
        <button className="bg-[#317C80] text-white text-lg px-2 py-1 rounded">Go</button>
      </div>
    </div>

    {/*  Category Filters */}
    <div className="mb-4">
      <h2 className="text-lg font-bold text-[#317C80] mb-1">Categories</h2>
      {[
        "Diapering",
        "Baby Bath",
        "Baby Food",
        "Wipes",
        "Baby Hair Care",
        "Baby Skin Care",
        "Baby Food By Age"
      ].map((cat, i) => (
        <div key={i} className="flex items-center justify-between cursor-pointer py-1 border-b">
          <span className="text-lg">{cat}</span>
          <span className='text-[20px]'>+</span>
        </div>
      ))}
    </div>

    {/*  Filters by Brand and Skin Type */}
    <h2 className="mb-2 text-lg font-bold text-[#317C80]">Filter By</h2>
    <FilterSection
      title="Brand"
      options={['Nivea', 'Himalaya', 'Pampers']}
      type="brand"
      selected={filters.brand}
      onChange={handleFilterChange}
    />
    <FilterSection
      title="Skin Type"
      options={['Oily', 'Dry', 'Normal']}
      type="skinType"
      selected={filters.skinType}
      onChange={handleFilterChange}
    />
  </div>
</div>

        {/* === Product Cards + Sorting + Pagination === */}
        <div className="w-full md:w-3/4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-gray-600">
              You searched for: <b>{category}</b>
            </p>
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

          {/* Pagination UI */}
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
