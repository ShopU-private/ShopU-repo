import React, { useState } from 'react';
import { ShoppingCart, Package, Heart, Star } from 'lucide-react';

const ShopUSpecialOffers = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCard, setSelectedCard] = useState<number>(2); // Default to 2nd card

  const offers = [
    {
      id: 1,
      price: "₹165",
      title: "Moov Pain Relief Ointment",
      discount: null,
      category: "Healthcare",
      rating: 4.5,
      reviews: 234
    },
    {
      id: 2,
      price: "₹165",
      title: "Covid 19 pack",
      subtitle: "Get it now 45% Off",
      discount: "45% Off",
      category: "Healthcare",
      rating: 4.8,
      reviews: 156,
      featured: true
    },
    {
      id: 3,
      price: "₹299",
      title: "Vitamin D3 Supplements",
      subtitle: "Boost your immunity",
      discount: "30% Off",
      category: "Wellness",
      rating: 4.6,
      reviews: 89
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Special Offers</h2>
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

          {/* Mobile */}
          <div className="sm:hidden">
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  onClick={() => setSelectedCard(offer.id)}
                  className={`relative flex-shrink-0 w-64 bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
                    selectedCard === offer.id ? 'ring-2 ring-teal-400 ring-opacity-50' : ''
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

                    <button className="w-full mt-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white py-2 rounded-lg text-sm font-semibold hover:from-teal-700 hover:to-teal-600 transition-all duration-200 flex items-center justify-center space-x-1 group">
                      <span>Shop now</span>
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden sm:grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {offers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => setSelectedCard(offer.id)}
                className={`relative bg-white rounded-xl lg:rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${
                  selectedCard === offer.id ? 'ring-2 lg:ring-4 ring-teal-400 ring-opacity-50' : ''
                }`}
              >
                {offer.discount && (
                  <div className="absolute top-3 lg:top-4 right-3 lg:right-4 bg-gradient-to-r from-red-500 to-red-400 text-white px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-bold z-10">
                    {offer.discount}
                  </div>
                )}

                <div className="p-4 lg:p-6">
                  <div className="inline-block bg-gray-800 text-white px-3 lg:px-4 py-1 lg:py-2 rounded-full text-sm lg:text-lg font-bold mb-3 lg:mb-4">
                    {offer.price}
                  </div>

                  <div className="w-full h-24 lg:h-32 bg-gradient-to-br from-teal-100 to-teal-50 rounded-lg lg:rounded-xl mb-3 lg:mb-4 flex items-center justify-center">
                    <Package className="w-8 lg:w-12 h-8 lg:h-12 text-teal-400" />
                  </div>

                  <div className="space-y-2 lg:space-y-3">
                    <div>
                      <h3 className="text-lg lg:text-xl font-bold text-gray-800 leading-tight">{offer.title}</h3>
                      {offer.subtitle && (
                        <p className="text-teal-600 font-medium text-sm lg:text-base mt-1">{offer.subtitle}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(offer.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({offer.reviews})</span>
                    </div>

                    <span className="inline-block bg-teal-100 text-teal-700 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium">
                      {offer.category}
                    </span>
                  </div>

                  <button className="w-full mt-4 lg:mt-6 bg-gradient-to-r from-teal-600 to-teal-500 text-white py-2 lg:py-3 rounded-lg lg:rounded-xl text-sm lg:text-base font-semibold hover:from-teal-700 hover:to-teal-600 transition-all duration-200 flex items-center justify-center space-x-2 group">
                    <span>Shop now</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden sm:flex justify-center mt-6 lg:mt-8 space-x-2">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  currentSlide === index ? 'bg-teal-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16">
          {[
            {
              icon: <ShoppingCart className="w-6 sm:w-8 h-6 sm:h-8 text-teal-600" />,
              title: 'Fast Delivery',
              desc: 'Get your orders delivered within 24 hours'
            },
            {
              icon: <Package className="w-6 sm:w-8 h-6 sm:h-8 text-teal-600" />,
              title: 'Quality Products',
              desc: '100% authentic and tested products'
            },
            {
              icon: <Heart className="w-6 sm:w-8 h-6 sm:h-8 text-teal-600" />,
              title: 'Customer Care',
              desc: '24/7 support for all your needs'
            }
          ].map((item, i) => (
            <div key={i} className="text-center p-4 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg">
              <div className="w-12 sm:w-16 h-12 sm:h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ShopUSpecialOffers;
