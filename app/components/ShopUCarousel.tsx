import React, { useState, useEffect } from 'react';
import { Camera, MessageCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const ShopUCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isOrderingNow, setIsOrderingNow] = useState(false);

  const slides = [
    {
      id: 1,
      image: '/image4.png',
      title: 'Covid 19 pack',
    },
    {
      id: 2,
      image: '/image5.png',
      title: 'Health Pack',
    },
    {
      id: 3,
      image: '/image6.png',
      title: 'Wellness Bundle',
    },
  ];

  const { addToCart } = useCart();

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index); // ✅ only this
  };

  const handleOrderNow = async () => {
    setIsOrderingNow(true);
    try {
      // Add the current slide's product to the cart
      const currentProduct = slides[currentSlide];
      await addToCart({
        productId: `promo_${currentProduct.id}`,
        quantity: 1,
      });
      // Dispatch cart updated event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      // You could also redirect to checkout or open cart modal here
    } catch (error) {
      console.error('Failed to place order:', error);
    } finally {
      setIsOrderingNow(false);
    }
  };

  return (
    <div className="mx-auto w-[90%] max-w-7xl space-y-4 p-2 sm:p-4">
      {/* Main Carousel */}
      <div className="flex flex-col gap-4 py-4 lg:flex-row">
        {/* Carousel Banner */}
        <div className="relative min-h-[250px] flex-3 overflow-hidden rounded-lg bg-gradient-to-br sm:min-h-[300px]">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map(slide => (
              <div key={slide.id} className="min-w-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="max-h-100 w-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 transform space-x-2 sm:bottom-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full transition-all sm:h-3 sm:w-3 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side Card */}
        <div className="hidden min-h-[150px] flex-1 rounded-xl bg-gray-200 sm:block sm:min-h-[200px] lg:min-h-[300px]">
          {/* Empty placeholder matching original design */}
        </div>
      </div>

      {/* WhatsApp Banner */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-lg border bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:gap-0 sm:p-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-500 sm:h-12 sm:w-12">
            <MessageCircle className="h-5 w-5 text-white sm:h-6 sm:w-6" />
          </div>
          <span className="text-sm font-medium text-gray-800 sm:text-base">
            Claim 5% Off on WhatsApp
          </span>
        </div>
        <button
          onClick={handleOrderNow}
          disabled={isOrderingNow}
          className="w-full rounded-lg bg-teal-600 px-4 py-2 text-xs text-white transition-colors hover:bg-teal-700 sm:w-auto sm:px-6 sm:text-sm"
        >
          {isOrderingNow ? 'Adding...' : 'Order now →'}
        </button>
      </div>
    </div>
  );
};

export default ShopUCarousel;
