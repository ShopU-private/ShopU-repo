'use client';

import { useState, useRef, useEffect } from 'react';
import SearchCard, { searchEventEmitter } from '../components/SearchCard';
import { SearchItem } from '../types/SearchItem';

export default function SearchbarResultPage() {
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [searchCache, setSearchCache] = useState<{ [key: string]: SearchItem[] }>({});
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);

  useEffect(() => {
    const timeout = searchTimeoutRef.current;
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  useEffect(() => {
    const cacheKeys = Object.keys(searchCache);
    if (cacheKeys.length > 50) {
      // Limit cache to last 50 searches
      const newCache = { ...searchCache };
      delete newCache[cacheKeys[0]];
      setSearchCache(newCache);
    }
  }, [searchCache]);
  // subscribe to search results
  useEffect(() => {
    const unsubscribe = searchEventEmitter.subscribe((results: SearchItem[]) => {
      setSearchResults(results);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="relative">
      <main className="flex items-center justify-center px-4 py-6">
        {searchResults.length > 0 ? (
          <div className="grid w-[90%] max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {searchResults.map(item => (
              <SearchCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-500">Search to see results</div>
        )}
      </main>
    </div>
  );
}
