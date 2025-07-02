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
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-36"></div>
                <div className="h-1 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <div className="hidden sm:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="h-64 bg-gray-200 rounded-xl"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
              <div className="h-64 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (offers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        No special medicines available at the moment.
      </div>
    );
  }

  return (
    <div className="min-h-xl bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-[90%]">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Special Medicines</h2>
              <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-teal-500 to-teal-300 rounded-full"></div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white shadow-lg border border-gray-200 hover:border-teal-300 transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white shadow-lg border border-gray-200 hover:border-teal-300 transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Cards - both mobile and desktop */}
          <div className="sm:hidden flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                selected={selectedCard === offer.id}
                onClick={() => setSelectedCard(offer.id)}
                onAddToCart={() => handleAddToCart(offer.id)}
              />
            ))}
          </div>

          <div className="hidden sm:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {offers.map((offer) => (
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
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
        selected ? 'ring-2 ring-teal-400 ring-opacity-50' : ''
      }`}
    >
      {offer.discount && (
        <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-400 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          {offer.discount}
        </div>
      )}
      <div className="p-4">
        <div className="inline-block bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-bold mb-3">
          {offer.price}
        </div>
        <div className="w-full h-20 bg-gradient-to-br from-teal-100 to-teal-50 rounded-lg mb-3 flex items-center justify-center">
          <Package className="w-8 h-8 text-teal-400" />
        </div>
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-bold text-gray-800 leading-tight line-clamp-2">{offer.title}</h3>
            {offer.manufacturerName && (
              <p className="text-gray-600 text-xs mt-1">{offer.manufacturerName}</p>
            )}
            {offer.subtitle && <p className="text-teal-600 font-medium text-xs mt-1">{offer.subtitle}</p>}
          </div>
          <div className="flex items-center space-x-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(offer.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({offer.reviews})</span>
          </div>
          <span className="inline-block bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs font-medium">
            {offer.category}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          className="w-full mt-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white py-2 rounded-lg text-sm font-semibold hover:from-teal-700 hover:to-teal-600 transition-all duration-200 flex items-center justify-center space-x-1 group"
        >
          <span>Add to Cart</span>
          <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ShopUSpecialOffers;
