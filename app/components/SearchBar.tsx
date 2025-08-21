import { searchEventEmitter } from './MedicineCard';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';

// Import Medicine type or define it here
interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

// Define the type for medicine search results
type MedicineResult = Array<Medicine>;

export default function Searchbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchCache, setSearchCache] = useState<{ [key: string]: MedicineResult }>({});
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const placeholders = [
    'Search "Medicines"',
    'Search "Baby Care Products"',
    'Search "Groceries"',
    'Search "Healthcare Essentials"',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [placeholders.length]);

  // Memoize the search function to avoid unnecessary rerenders
  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Set a new timeout to debounce the search
      searchTimeoutRef.current = setTimeout(async () => {
        if (query.trim().length >= 3) {
          // Check if the results are in the cache
          if (searchCache[query.trim()]) {
            searchEventEmitter.emit(searchCache[query.trim()]);
            return;
          }

          setIsSearching(true);
          try {
            const response = await fetch(
              `/api/get-medicine?name=${encodeURIComponent(query)}&limit=30`
            );
            const data = await response.json();
            if (data.success) {
              const results = data.data.slice(0, 30);
              searchEventEmitter.emit(results);

              // Store in cache
              setSearchCache(prev => ({
                ...prev,
                [query.trim()]: results,
              }));
            } else {
              searchEventEmitter.emit([]);
            }
          } catch (error) {
            console.error('Search error:', error);
            searchEventEmitter.emit([]);
          }
          setIsSearching(false);
        } else {
          searchEventEmitter.emit([]);
        }
      }, 300);
    },
    [searchCache]
  );

  const clearSearch = () => {
    setSearchQuery('');
    searchEventEmitter.emit([]);
  };

  // Clear cache when component unmounts or if it gets too large
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Limit cache size to prevent memory issues
  useEffect(() => {
    const cacheKeys = Object.keys(searchCache);
    if (cacheKeys.length > 50) {
      // Limit cache to last 50 searches
      const newCache = { ...searchCache };
      delete newCache[cacheKeys[0]];
      setSearchCache(newCache);
    }
  }, [searchCache]);

  return (
    <div className="relative mx-4 hidden max-w-lg flex-1 md:flex">
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          placeholder={placeholders[placeholderIndex]}
          className="w-full rounded-lg bg-gray-100 px-4 py-2 pl-10 focus:outline-none"
        />
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        {isSearching && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
            <div className="border-primaryColor h-5 w-5 animate-spin rounded-full border-b-2"></div>
          </div>
        )}
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute top-1/2 right-4 -translate-y-1/2 transform text-gray-600 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
