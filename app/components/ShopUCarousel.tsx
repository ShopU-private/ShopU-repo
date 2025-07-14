import React, { useState, useEffect } from 'react';
import { Camera, MessageCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { WhatsappCard } from 'twilio/lib/rest/content/v1/content';
import { FaFacebookF, FaWhatsapp } from 'react-icons/fa';

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
      <div className="flex flex-col gap-5 py-2 lg:flex-row">
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
        <div className="relative flex w-64 flex-col items-center space-y-3 rounded-xl bg-gray-100 px-6 py-4 text-center shadow">
          {/* Top Badge */}
          <div className="text-secondaryColor absolute top-3 left-4 text-xl font-semibold">
            <p>Special Deal</p>
          </div>
          <div className="bg-background2 absolute top-0 right-0 rounded-tr-xl rounded-bl-2xl px-3 py-1 text-sm font-bold text-white">
            <p>
              46% <br />
              OFF
            </p>
          </div>

          {/* Product Image */}
          <img src="/pediasure.png" alt="Pediasure" className="mt-8 h-36 object-contain" />

          {/* Product Name */}
          <p className="text-left text-sm font-medium text-gray-800">
            Pediasure Chocolate Flavour Nutrition..
          </p>

          {/* Price + Add */}
          <div className="flex w-full items-center justify-between border-t border-gray-200 px-2 pt-1">
            <div className="flex items-baseline gap-1">
              <span className="text-primaryColor text-lg font-bold">₹51</span>
              <span className="text-sm text-gray-400 line-through">₹96</span>
            </div>
            <button className="bg-background1 rounded px-5 py-1 text-sm font-medium text-white">
              ADD
            </button>
          </div>

          {/* Countdown */}
          <div className="w-full px-2 text-left">
            <p className="pt-2 text-xs font-medium text-gray-700">Hurry Up! Offer ends in:</p>
            <div className="mt-1 flex justify-center gap-2 rounded bg-gray-100 p-2 text-sm font-semibold text-gray-800">
              <div className="text-center">
                <div>00</div>
                <div className="text-xs font-normal">Hours</div>
              </div>
              <span>:</span>
              <div className="text-center">
                <div>00</div>
                <div className="text-xs font-normal">Mins</div>
              </div>
              <span>:</span>
              <div className="text-center">
                <div>00</div>
                <div className="text-xs font-normal">Secs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Banner */}
      <div className="bg-background1 flex h-46 w-full flex-col items-center justify-between rounded-lg px-14 py-4 text-white sm:flex-row">
        {/* Left: Logo & Text */}
        <div className="flex w-full flex-col items-center gap-10 sm:w-auto sm:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src="/ShopULogo.png" alt="Shopu Logo" className="h-20 w-40" />
          </div>

          {/* Text */}
          <div className="text-center sm:text-left">
            <p className="text-lg font-medium sm:text-lg">Now available on</p>
            <h1 className="py-2 text-4xl font-semibold">WHATSAPP</h1>
            <p className="mt-1 text-sm sm:text-base">Click to order.</p>
          </div>
        </div>

        {/* Middle: WhatsApp Button */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primaryColor flex items-center gap-2 rounded-md border border-white bg-white px-8 py-3 text-xl font-medium font-semibold shadow hover:shadow-lg"
        >
          <FaWhatsapp className="text-2xl" />
          WhatsApp
        </a>

        {/* Right: Illustration */}
        <div className="hidden sm:block">
          <img src="/specialimage.png" alt="WhatsApp Illustration" className="h-36" />
        </div>
      </div>
    </div>
  );
};

export default ShopUCarousel;
