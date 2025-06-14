'use client';
import Header from './components/Header';
import ChatBot from './components/ChatBot';

import MedicineCard from './components/MedicineCard';
import React, { useState, useEffect } from 'react';
import { searchEventEmitter } from './components/MedicineCard';
import Footer from './components/Footer';

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function Home() {
  const [searchResults, setSearchResults] = useState<Medicine[]>([]);

  useEffect(() => {
    const unsubscribe = searchEventEmitter.subscribe(results => {
      setSearchResults(results);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {searchResults.map(medicine => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-center text-gray-500">Search for medicines to see results</div>
        )}
      </main>
      <Footer/>
      <ChatBot />
    </div>
  );
}
