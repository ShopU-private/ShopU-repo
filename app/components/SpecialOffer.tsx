'use client';

import React, { useState, useEffect } from 'react';
import { Package, Star } from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface Offer {
  id: string;
  price: string;
  originalPrice: string;
  title: string;
  discount: string;
  category: string;
  rating: number;
  reviews: number;
  subtitle?: string;
  featured?: boolean;
  manufacturerName?: string;
}

interface MedicineAPI {
  id: string;
  name: string;
  price: string;
  packSizeLabel?: string;
  manufacturerName?: string;
  type?: string;
}

const ShopUSpecialOffers = () => {
  // Removed unused currentSlide state
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/get-medicine?limit=3');

        if (!response.ok) throw new Error('Failed to fetch medicines');
        const data = await response.json();
        const medicines: MedicineAPI[] = data.data;

        if (!data.success || !Array.isArray(medicines) || medicines.length === 0) {
          throw new Error('No medicines found');
        }

        const specialOffers: Offer[] = medicines.map((medicine, index) => {
          const discount = 10 + Math.floor(Math.random() * 30); // 10–39%
          const originalPrice = parseFloat(medicine.price);
          const discountedPrice = originalPrice * (1 - discount / 100);

          return {
            id: medicine.id,
            price: `₹${discountedPrice.toFixed(0)}`,
            originalPrice: `₹${originalPrice.toFixed(0)}`,
            title: medicine.name,
            subtitle:
              index === 1
                ? `Get it now ${discount}% Off`
                : medicine.packSizeLabel || 'Standard Pack',
            discount: `${discount}% Off`,
            category: medicine.type || 'Healthcare',
            manufacturerName: medicine.manufacturerName,
            rating: 4.5 + ((index * 0.1) % 0.5),
            reviews: 80 + index * 30,
            featured: index === 1,
          };
        });

        setOffers(specialOffers);
        setSelectedCard(specialOffers[0].id);
      } catch (error) {
        console.error('Error fetching special medicines:', error);
        setOffers([]);
        setSelectedCard('');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  // Removed nextSlide and prevSlide functions as currentSlide is not used
  const nextSlide = () => {};
  const prevSlide = () => {};

  const handleAddToCart = async (offerId: string) => {
    try {
      await addItem(null, offerId, 1);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Failed to add medicine to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="animate-pulse">
            <div className="mb-6 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-6 w-36 rounded bg-gray-200"></div>
                <div className="h-1 w-20 rounded bg-gray-200"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              </div>
            </div>
            <div className="hidden gap-4 sm:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              <div className="h-64 rounded-xl bg-gray-200"></div>
              <div className="h-64 rounded-xl bg-gray-200"></div>
              <div className="h-64 rounded-xl bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-500">
        No special medicines available at the moment.
      </div>
    );
  }

  return (
    <div className="min-h-xl bg-gray-50">
      <main className="mx-auto w-[90%] max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <div className="mb-6 flex items-center justify-between sm:mb-8">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                Special Medicines
              </h2>
              <hr className="mt-1 h-1 w-64 rounded border-0 bg-[#317C80]" />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                className="rounded-full border border-gray-200 bg-white p-2 shadow-lg transition-colors hover:border-teal-300"
              >
                <svg
                  className="h-4 w-4 text-teal-600 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="rounded-full border border-gray-200 bg-white p-2 shadow-lg transition-colors hover:border-teal-300"
              >
                <svg
                  className="h-4 w-4 text-teal-600 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Cards - both mobile and desktop */}
          <div className="scrollbar-hide flex space-x-4 overflow-x-auto pb-4 sm:hidden">
            {offers.map(offer => (
              <OfferCard
                key={offer.id}
                offer={offer}
                selected={selectedCard === offer.id}
                onClick={() => setSelectedCard(offer.id)}
                onAddToCart={() => handleAddToCart(offer.id)}
              />
            ))}
          </div>

          <div className="hidden gap-4 sm:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {offers.map(offer => (
              <OfferCard
                key={offer.id}
                offer={offer}
                selected={selectedCard === offer.id}
                onClick={() => setSelectedCard(offer.id)}
                onAddToCart={() => handleAddToCart(offer.id)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const OfferCard = ({
  offer,
  selected,
  onClick,
  onAddToCart,
}: {
  offer: Offer;
  selected: boolean;
  onClick: () => void;
  onAddToCart: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative transform cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${
        selected ? 'ring-opacity-50 ring-2 ring-teal-400' : ''
      }`}
    >
      {offer.discount && (
        <div className="absolute top-3 right-3 z-10 rounded-full bg-gradient-to-r from-red-500 to-red-400 px-2 py-1 text-xs font-bold text-white">
          {offer.discount}
        </div>
      )}
      <div className="p-4">
        <div className="mb-3 inline-block rounded-full bg-gray-800 px-3 py-1 text-sm font-bold text-white">
          {offer.price}
        </div>
        <div className="mb-3 flex h-20 w-full items-center justify-center rounded-lg bg-gradient-to-br from-teal-100 to-teal-50">
          <Package className="h-8 w-8 text-teal-400" />
        </div>
        <div className="space-y-2">
          <div>
            <h3 className="line-clamp-2 text-sm leading-tight font-bold text-gray-800">
              {offer.title}
            </h3>
            {offer.manufacturerName && (
              <p className="mt-1 text-xs text-gray-600">{offer.manufacturerName}</p>
            )}
            {offer.subtitle && (
              <p className="mt-1 text-xs font-medium text-teal-600">{offer.subtitle}</p>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(offer.rating) ? 'fill-current text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({offer.reviews})</span>
          </div>
          <span className="inline-block rounded-full bg-teal-100 px-2 py-1 text-xs font-medium text-teal-700">
            {offer.category}
          </span>
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="group mt-4 flex w-full items-center justify-center space-x-1 rounded-lg bg-gradient-to-r from-teal-600 to-teal-500 py-2 text-sm font-semibold text-white transition-all duration-200 hover:from-teal-700 hover:to-teal-600"
        >
          <span>Add to Cart</span>
          <svg
            className="h-3 w-3 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ShopUSpecialOffers;
