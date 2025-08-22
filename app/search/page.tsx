'use client';
import React, { useState, useRef, useEffect } from 'react';
import MedicineCard, { searchEventEmitter } from '../components/MedicineCard';

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
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchCache, setSearchCache] = useState<{ [key: string]: MedicineResult }>({});
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);

  // Clear cache when component unmounts or if it gets too large
  useEffect(() => {
    const timeout = searchTimeoutRef.current; // copy to variable
    return () => {
      if (timeout) {
        clearTimeout(timeout);
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

  // Subscribe to search results
  useEffect(() => {
    const unsubscribe = searchEventEmitter.subscribe((results: Medicine[]) => {
      setSearchResults(results);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="relative">
      <main className="flex items-center justify-center px-4 py-8">
        {searchResults.length > 0 ? (
          <div className="grid w-[90%] max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {searchResults.map(medicine => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-500">Search for medicines to see results</div>
        )}
      </main>
    </div>
  );
}
