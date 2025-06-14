import { searchEventEmitter } from './MedicineCard';
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function Searchbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a new timeout to debounce the search
    searchTimeoutRef.current = setTimeout(async () => {
      if (query.trim().length >= 3) {
        setIsSearching(true);
        try {
          const response = await fetch(
            `/api/get-medicine?name=${encodeURIComponent(query)}&limit=30`
          );
          const data = await response.json();
          if (data.success) {
            searchEventEmitter.emit(data.data.slice(0, 30));
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
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchEventEmitter.emit([]);
  };
  return (
    <div className="relative mx-4 hidden max-w-lg flex-1 md:flex">
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          placeholder="Search essentials, groceries and more..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
        />
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        {isSearching && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-teal-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}
