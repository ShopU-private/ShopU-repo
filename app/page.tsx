'use client';
import ChatBot from './components/ChatBot';
import HealthLayout from './components/ShopUHealthLayout';
import MedicineCard from './components/MedicineCard';
import React, { useState, useEffect } from 'react';
import { searchEventEmitter } from './components/MedicineCard';
import ShopUCarousel from './components/ShopUCarousel';
import DealOfTheWeek from './components/DealsOfTheWeek';
import ShopUSpecialOffers from './components/SpecialOffer';
import BabyCareSection from './components/BabyCareSection';
import WomenCareSection from './components/WomenCareSection';
import BrandSection from './components/ShopByBrand';
import PersonalCareSection from './components/PersonalCareSection';
import EverydayEssentialsSection from './components/EverydayEssentialsSection';
import FeatureSection from './components/FeatureSection';
import PromoBanner from './components/Promobanner';

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
    <>
      <ShopUCarousel />
      <HealthLayout />
      <DealOfTheWeek />
      <ShopUSpecialOffers />
      <BabyCareSection />
      <BrandSection />
      <WomenCareSection />
      <PersonalCareSection />
      <PromoBanner />
      <EverydayEssentialsSection />
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
      <FeatureSection />

      <ChatBot />
    </>
  );
}
