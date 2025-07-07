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
<<<<<<< HEAD
      price: '₹165',
      title: 'Covid 19 pack',
      subtitle: 'Get it now 45% Off',
      buttonText: 'Show now',
    },
    {
      id: 2,
      price: '₹299',
      title: 'Health Pack',
      subtitle: 'Essential medicines 30% Off',
      buttonText: 'Order now',
    },
    {
      id: 3,
      price: '₹450',
      title: 'Wellness Bundle',
      subtitle: 'Complete care 25% Off',
      buttonText: 'Buy now',
    },
=======
      image: "/image4.png",
      title: "Covid 19 pack",
    },
    {
      id: 2,
      image: "/image5.png",
      title: "Health Pack",
    },
    {
      id: 3,
      image: "/image6.png",
      title: "Wellness Bundle",
    }
>>>>>>> f6a1dc91063cebddc87d89c36f350f5a8279f26f
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

<<<<<<< HEAD
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
=======

  const goToSlide = (index: number) => {
    setCurrentSlide(index); // ✅ only this
>>>>>>> f6a1dc91063cebddc87d89c36f350f5a8279f26f
  };


  const handleOrderNow = async () => {
    setIsOrderingNow(true);
    try {
      // Add the current slide's product to the cart
      const currentProduct = slides[currentSlide];
      await addToCart({
        productId: `promo_${currentProduct.id}`,
<<<<<<< HEAD
        quantity: 1,
=======
        quantity: 1
>>>>>>> f6a1dc91063cebddc87d89c36f350f5a8279f26f
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
<<<<<<< HEAD
    <div className="mx-auto max-w-6xl space-y-4 p-2 sm:p-4">
      {/* Main Carousel */}
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Carousel Banner */}
        <div className="relative min-h-[250px] flex-2 overflow-hidden rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 sm:min-h-[300px]">
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map(slide => (
              <div
                key={slide.id}
                className="relative w-full flex-shrink-0 bg-gradient-to-br from-teal-500 to-teal-700 p-4 text-white sm:p-6 lg:p-8"
              >
                {/* Price Badge */}
                <div className="mb-3 inline-block rounded-full bg-black/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm sm:mb-4 sm:px-3 sm:text-sm">
                  {slide.price}
                </div>

                {/* Content */}
                <div className="max-w-xs space-y-2 sm:max-w-sm sm:space-y-3">
                  <h2 className="text-xl leading-tight font-bold text-white sm:text-2xl lg:text-3xl">
                    {slide.title}
                  </h2>
                  <p className="text-sm text-teal-100 sm:text-lg">{slide.subtitle}</p>

                  <button className="mt-3 rounded-lg bg-white/20 px-4 py-2 text-xs text-white backdrop-blur-sm transition-all hover:bg-white/30 sm:mt-4 sm:px-6 sm:text-sm">
                    {slide.buttonText} →
                  </button>
                </div>

                {/* Icon */}
                <div className="absolute top-1/2 left-1/2 ml-38 -translate-x-1/2 -translate-y-1/2 transform">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                    <Camera className="h-4 w-4 text-white sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                  </div>
                </div>
=======
    <div className="max-w-7xl mx-auto p-2 sm:p-4 space-y-4 w-[90%] ">
      {/* Main Carousel */}
      <div className="flex flex-col lg:flex-row gap-4 py-4">
        {/* Carousel Banner */}
        <div className="flex-3 relative bg-gradient-to-br rounded-lg overflow-hidden min-h-[250px] sm:min-h-[300px]">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide) => (
              <div key={slide.id} className="min-w-full">
                <img src={slide.image} alt={slide.title} className="max-h-100 w-full object-cover" />
>>>>>>> f6a1dc91063cebddc87d89c36f350f5a8279f26f
              </div>
            ))}
          </div>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 transform space-x-2 sm:bottom-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
<<<<<<< HEAD
                className={`h-2 w-2 rounded-full transition-all sm:h-3 sm:w-3 ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
=======
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${index === currentSlide
                  ? 'bg-white'
                  : 'bg-white/50'
                  }`}
>>>>>>> f6a1dc91063cebddc87d89c36f350f5a8279f26f
              />
            ))}
          </div>
        </div>

        {/* Right Side Card */}
<<<<<<< HEAD
        <div className="hidden min-h-[150px] flex-1 rounded-lg bg-gray-200 sm:block sm:min-h-[200px] lg:min-h-[300px]">
=======
        <div className="flex-1 bg-gray-200 rounded-xl min-h-[150px] sm:min-h-[200px] lg:min-h-[300px] hidden sm:block">
>>>>>>> f6a1dc91063cebddc87d89c36f350f5a8279f26f
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
