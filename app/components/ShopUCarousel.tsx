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
      price: "₹165",
      title: "Covid 19 pack",
      subtitle: "Get it now 45% Off",
      buttonText: "Show now"
    },
    {
      id: 2,
      price: "₹299",
      title: "Health Pack",
      subtitle: "Essential medicines 30% Off",
      buttonText: "Order now"
    },
    {
      id: 3,
      price: "₹450",
      title: "Wellness Bundle",
      subtitle: "Complete care 25% Off",
      buttonText: "Buy now"
    }
  ];

  const { addToCart } = useCart();

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index:number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const handleOrderNow = async () => {
    setIsOrderingNow(true);
    try {
      // Add the current slide's product to the cart
      const currentProduct = slides[currentSlide];
      await addToCart({ 
        productId: `promo_${currentProduct.id}`, 
        quantity: 1 
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
    <div className="max-w-7xl mx-auto p-2 sm:p-4 space-y-4 w-[90%]">
      {/* Main Carousel */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Carousel Banner */}
        <div className="flex-2 relative bg-gradient-to-br from-teal-500 to-teal-700 rounded-lg overflow-hidden min-h-[250px] sm:min-h-[300px]">
          <div className="flex transition-transform duration-500 ease-in-out h-full"
               style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide) => (
              <div key={slide.id} className="w-full flex-shrink-0 bg-gradient-to-br from-teal-500 to-teal-700 relative p-4 sm:p-6 lg:p-8 text-white">
                {/* Price Badge */}
                <div className="inline-block bg-black/20 backdrop-blur-sm text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                  {slide.price}
                </div>
                
                {/* Content */}
                <div className="space-y-2 sm:space-y-3 max-w-xs sm:max-w-sm">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-sm sm:text-lg text-teal-100">
                    {slide.subtitle}
                  </p>
                  
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm transition-all mt-3 sm:mt-4">
                    {slide.buttonText} →
                  </button>
                </div>
                
                {/* Icon */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ml-38">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6  text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Dot Indicators */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-white' 
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Side Card */}
        <div className="flex-1 bg-gray-200 rounded-lg min-h-[150px] sm:min-h-[200px] lg:min-h-[300px] hidden sm:block">
          {/* Empty placeholder matching original design */}
        </div>
      </div>

      {/* WhatsApp Banner */}
      <div className="bg-white rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm border gap-3 sm:gap-0">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="text-gray-800 font-medium text-sm sm:text-base">Claim 5% Off on WhatsApp</span>
        </div>
        <button 
          onClick={handleOrderNow}
          disabled={isOrderingNow}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm transition-colors w-full sm:w-auto"
        >
          {isOrderingNow ? 'Adding...' : 'Order now →'}
        </button>
      </div>
    </div>
  );
};

export default ShopUCarousel;