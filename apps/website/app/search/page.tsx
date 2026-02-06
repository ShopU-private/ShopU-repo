'use client';

import { useState, useRef, useEffect } from 'react';
import SearchCard, { searchEventEmitter } from '../components/SearchCard';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Searchbar from '../components/SearchBar';
import { SearchItem } from '@shopu/types-store/types';

export default function SearchbarResultPage() {
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const timeout = searchTimeoutRef.current;
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const handleSearch = (results: SearchItem[]) => {
    setSearchResults(results);
  };

  // subscribe to search results
  useEffect(() => {
    const unsubscribe = searchEventEmitter.subscribe((results: SearchItem[]) => {
      handleSearch(results);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="bg-background1 flex items-center justify-start px-4 py-2 md:hidden">
        <div>
          <button onClick={() => router.back()}>
            <ArrowLeft className="h-7 w-10 text-white" />
          </button>
        </div>
        <Searchbar />
      </div>
      <div className="relative">
        <main className="flex items-center justify-center px-4 py-6">
          {searchResults.length > 0 ? (
            <div className="grid w-full max-w-7xl grid-cols-2 gap-2 sm:w-[90%] sm:grid-cols-2 sm:gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {searchResults.map(item => (
                <SearchCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="mt-16 text-center text-gray-500">Search to see results</div>
          )}
        </main>
      </div>
    </>
  );
}
