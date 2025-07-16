'use client';
import React, { useState, useRef } from 'react';

type PackOption = {
  quantity: number;
  price: number;
  perUnit: string;
  stock: string;
};
const products = [
  {
    title: 'MamyPoko Extra Absorb Diaper Pants Large,',
    quantity: '98 Count',
    mrp: '₹1970',
    price: '₹1230',
    discount: '50% OFF',
    image: '/images/diaper.png', // replace with actual image path
    timer: '',
  },
  {
    title: 'MamyPoko Extra Absorb Diaper Pants Large,',
    quantity: '98 Count',
    mrp: '₹1970',
    price: '₹1230',
    discount: '50% OFF',
    image: '/images/diaper.png', // replace with actual image path
    timer: '',
  },
  {
    title: 'Cetaphil Baby Daily lotion, 400 ml',
    quantity: 'tube of 450 ml Gel',
    mrp: '₹1260',
    price: '₹710',
    discount: '50% OFF',
    image: '/images/cetaphil.png',
    timer: '05:02:12',
  },
  {
    title: 'Nestle Nan Pro Stage 2 Formula Milk',
    quantity: 'tube of 30 ml Gel',
    mrp: '₹1260',
    price: '₹630',
    discount: '50% OFF',
    image: '/images/nan.png',
    timer: '05:02:12',
  },
  {
    title: 'Dabur Ashokarishta, 450 ml',
    quantity: 'tube of 100 ml Gel',
    mrp: '₹160',
    price: '₹140',
    discount: '50% OFF',
    image: '/images/dabur.png',
    timer: '',
  },
  {
    title: 'Flamingo Heat Belt Large, 1 Count',
    quantity: 'tube of 30 ml Gel',
    mrp: '₹320',
    price: '₹280',
    discount: '50% OFF',
    image: '/images/flamingo.png',
    timer: '05:02:12',
  },
  {
    title: 'Flamingo Heat Belt Large, 1 Count',
    quantity: 'tube of 30 ml Gel',
    mrp: '₹320',
    price: '₹280',
    discount: '50% OFF',
    image: '/images/flamingo.png',
    timer: '05:02:12',
  },
];
export default function ProductView() {
  const images = [
    'https://uploads.onecompiler.io/42zhuec4k/43ppbsg9g/Capturekjk.PNG',
    'https://uploads.onecompiler.io/42zhuec4k/43ppbsg9g/Capturekjk.PNG',
    'https://uploads.onecompiler.io/42zhuec4k/43ppbsg9g/Capturekjk.PNG',
    'https://uploads.onecompiler.io/42zhuec4k/43ppbsg9g/Capturekjk.PNG',
    'https://uploads.onecompiler.io/42zhuec4k/43ppbsg9g/Capturekjk.PNG',
    'https://uploads.onecompiler.io/42zhuec4k/43ppbsg9g/Capturekjk.PNG',
  ];

  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

  const handleScrollUp = () => {
    setStartIndex(prev => Math.max(0, prev - 1));
  };

  const handleScrollDown = () => {
    setStartIndex(prev => Math.min(images.length - visibleCount, prev + 1));
  };

  const visibleImages = images.slice(startIndex, startIndex + visibleCount);

  const [selectedSize, setSelectedSize] = useState<string>('Large');
  const sizes: string[] = ['Large', 'Small', 'Medium', 'New Born', 'XL', 'XXL'];

  const [selectedPackIndex, setSelectedPackIndex] = useState<number>(0);

  const packOptions: PackOption[] = [
    { quantity: 96, price: 1270, perUnit: '₹13.32 Per Unit', stock: 'In Stock' },
    { quantity: 56, price: 970, perUnit: '₹11.32 Per Unit', stock: 'In Stock' },
    { quantity: 34, price: 770, perUnit: '₹9.32 Per Unit', stock: 'In Stock' },
    { quantity: 20, price: 270, perUnit: '₹5.32 Per Unit', stock: 'In Stock' },
  ];

  const [quantity, setQuantity] = useState<number>(1);

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -460 : 460,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-xl py-5">
      <div className="mx-auto grid w-[90%] max-w-7xl gap-8 rounded p-4 md:grid-cols-2">
        {/* Left: Image Gallery */}
        <div className="flex flex-col-reverse gap-6 sm:flex-row">
          {/* Thumbnails: horizontal on mobile, vertical on sm+ */}
          <div className="no-scrollbar flex flex-row items-center gap-2 overflow-x-auto sm:flex-col sm:space-y-2 sm:overflow-visible">
            <button
              onClick={handleScrollUp}
              disabled={startIndex === 0}
              className="bg-background1 hidden rounded-full px-4 py-2 text-xl text-white disabled:opacity-50 sm:block"
            >
              ↑
            </button>

            {visibleImages.map((src, index) => (
              <img
                key={index + startIndex}
                src={src}
                className="h-16 w-16 rounded border border-gray-200"
                alt={`thumb${index + 1}`}
              />
            ))}

            <button
              onClick={handleScrollDown}
              disabled={startIndex + visibleCount >= images.length}
              className="bg-background1 hidden rounded-full px-4 py-2 text-xl text-white disabled:opacity-50 sm:block"
            >
              ↓
            </button>
          </div>

          {/* Main Image */}
          <div className="flex w-24 w-full flex-1 items-center justify-center rounded-lg bg-white p-6">
            <img
              src="https://uploads.onecompiler.io/42zhuec4k/43ppbsg9g/Capturekjk.PNG"
              className="max-h-[300px] w-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
              alt="Main Product"
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-4">
          <div className="flex items-start gap-6">
            <div className="w-[70%]">
              <h2 className="text-xl font-semibold">
                Pampers Premium Care Diaper Pants XXL, 30 Count
              </h2>
            </div>
            <div className="flex justify-between gap-6">
              <button className="text-primaryColor text-4xl">♡</button>
              <button className="text-primaryColor text-4xl">♡</button>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <p className="my-4 text-sm font-medium">Select Sizes</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`cursor-pointer rounded px-4 py-2 text-sm transition duration-200 ${
                    selectedSize === size ? 'bg-background1 text-white' : 'bg-[#D9D9D9] text-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Pack Sizes */}
          <div className="w-full pb-2">
            <p className="my-4 text-sm font-medium">Select Pack Sizes :</p>

            <div className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth sm:grid sm:grid-cols-5 sm:gap-4">
              {packOptions.map((pack, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedPackIndex(index)}
                  className={`w-[calc(100%/3)] flex-shrink-0 cursor-pointer rounded transition duration-200 sm:w-auto sm:flex-shrink ${
                    selectedPackIndex === index
                      ? 'bg-background1 text-white'
                      : 'bg-[#D9D9D9] text-black'
                  }`}
                >
                  <p className="p-2 text-sm">{pack.quantity}</p>
                  <hr className="text-gray-100" />
                  <div className="p-2">
                    <p className="mb-2 text-sm font-semibold">₹{pack.price}</p>
                    <p className="mb-2 text-xs">({pack.perUnit})</p>
                    <p className="text-xs">{pack.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity + Price */}
          <div className="items-center gap-4">
            <div className="my-4 flex w-32 items-center rounded border px-2 py-1">
              <button onClick={handleDecrement} className="px-2 text-2xl">
                −
              </button>
              <span className="w-12 px-3 text-center">{quantity.toString().padStart(2, '0')}</span>
              <button onClick={handleIncrement} className="px-2 text-2xl">
                +
              </button>
            </div>

            <div className="flex">
              <p className="text-primaryColor mr-2 text-xl font-semibold">₹1070*</p>
              <p className="mt-2 text-sm text-gray-500">
                <span className="line-through">MRP: ₹1270</span>{' '}
                <span className="text-green-600">10% OFF</span>
              </p>
            </div>
          </div>

          {/* Add to Cart */}
          <div>
            <button className="bg-background1 flex w-56 cursor-pointer items-center justify-center gap-2 rounded py-3 font-medium text-white transition-transform duration-300 hover:scale-105">
              <img src="/Vector.png" alt="Cart" className="h-5 w-5" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <div className="text-md mx-auto w-[90%] max-w-7xl px-4 py-8 leading-relaxed text-gray-800">
        {/* Description */}
        <div className="mb-6">
          <h2 className="mb-2 text-base text-xl font-semibold">Description</h2>
          <p className="pl-4">
            Best 12 hours absorbent pants' ever in MamyPoko product history in India, has +60% Deep
            Absorbent CrissCross with extra 3rd layer that absorbs urine deeply and provides 2x
            protection for thigh leakage without sogginess whole night so baby & mother can sleep
            deeply whole night'.
          </p>
        </div>

        {/* Directions for Use - Basic */}
        <div className="mb-6">
          <h2 className="mb-2 text-base text-xl font-semibold">Directions for Use</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>To wear - Pull up the diaper like pants.</li>
            <li>To remove - simply tear off both sides and pull the diaper down.</li>
          </ul>
        </div>

        {/* Directions for Use - Features */}
        <div className="mb-6">
          <h2 className="mb-2 text-base text-xl font-semibold">Directions for Use</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              +60% Deep Absorbent crisscross sheet - that absorbs urine deeply leaving no wetness on
              the topsheet. So prevents leakage without sogginess for up to 12 hours.
            </li>
            <li>
              Innovative Flexi Fit - that adjusts gently and evenly distributes pressure across
              baby's tummy & back to provide 2X Protection for Thigh Leakage.
            </li>
            <li>
              Skin Friendly sheet - The topsheet is enriched with the goodness of coconut oil making
              it skin friendly.
            </li>
            <li>Prevents thigh gaps and redness</li>
          </ul>
        </div>

        {/* Safety Information */}
        <div>
          <h2 className="mb-2 text-base text-xl font-semibold">Safety Information</h2>
          <p>
            Keep the diaper pants away from children and pets to prevent accidental ingestion. Every
            pant is one time use only. Diapers should be changed cleanly and hygienically to
            minimise the risk of infection. Ensure that the diaper pants are not too tight to allow
            proper circulation and ease of movement for your baby. In case of any skin irritation or
            allergy, discontinue use and consult a doctor.
          </p>
        </div>
      </div>
      <div className="mx-auto w-[90%] max-w-7xl px-4 py-10">
        <h2 className="text-primaryColor mb-6 text-2xl font-semibold">
          Similar <span className="text-secondaryColor">Products</span>
          <hr className="bg-background1 h-1 w-[18%] rounded border-0" />
        </h2>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="bg-background1 absolute top-1/2 left-0 z-10 flex hidden h-8 w-8 -translate-y-1/2 transform items-center justify-center rounded-full text-white sm:block"
          >
            <svg
              className="ml-1 h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div ref={scrollRef} className="no-scrollbar flex gap-4 overflow-x-auto px-4 py-4">
            {products.map((product, idx) => (
              <div
                key={idx}
                className="max-w-[210px] min-w-[210px] flex-shrink-0 rounded-lg bg-white p-3 shadow-sm transition-transform duration-300 hover:scale-102 sm:w-[150px]"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="mx-auto h-36 object-contain p-4"
                />
                <div className="mt-3 space-y-1 px-4">
                  {product.timer && (
                    <p className="text-xs font-medium text-red-500">
                      End In <span className="font-semibold text-[#317C80]">{product.timer}</span>
                    </p>
                  )}
                  <p className="text-sm font-medium">{product.title}</p>
                  <p className="text-xs text-gray-500">{product.quantity}</p>
                  <hr className="text-[#D9D9D9]" />
                  <p className="text-xs text-gray-500">
                    MRP <s>{product.mrp}</s>{' '}
                    <span className="font-medium text-green-500">{product.discount}</span>
                  </p>
                  <p className="text-lg font-semibold text-[#317C80]">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Right Scroll Button */}
          <button
            onClick={() => scroll('right')}
            className="bg-background1 absolute top-1/2 right-[-5px] z-10 flex hidden h-8 w-8 -translate-y-1/2 transform justify-center rounded-full text-white sm:block"
          >
            <svg
              className="ml-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
