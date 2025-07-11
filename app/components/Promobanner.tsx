'use client';

import Image from 'next/image';
import React from 'react';

const PromoBanner = () => {
  return (
    <div className="mx-auto grid w-[90%] max-w-7xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-3">
      {/* Card 1 - Hair Supplement */}
      <div className="flex h-56 items-center justify-between rounded-xl bg-[#FFEAE6] p-4 transition-transform duration-400 hover:scale-102 md:p-6">
        {/* Text */}
        <div className="flex flex-col p-4 pt-6 text-[#993A26] transition-transform duration-300 group-hover:scale-105">
          <h2 className="text-3xl leading-none font-black">Hair</h2>
          <span className="mb-2 text-lg font-bold">Supplement</span>
          <hr className="mb-1 h-0.5 bg-black" />
          <p className="mb-2 text-sm text-black">With Folic Acid, Iron & Vitamin E</p>
          <button className="mt-auto w-fit rounded-full bg-[#993A26] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c14b2d]">
            Order now →
          </button>
        </div>

        {/* Image */}
        <div className="relative h-32 w-32 md:h-36 md:w-36">
          <Image src="/hair.png" alt="Hair Supplement" fill className="object-contain" />
        </div>
      </div>

      {/* Card 2 - Banner Image Only */}
      <div className="bg-background relative h-56 overflow-hidden rounded-xl transition-transform duration-400 hover:scale-102">
        <Image src="/banner1.jpg" alt="Banner" fill className="object-cover" />
      </div>

      {/* Card 3 - Image Only */}
      <div className="bg-background relative h-56 overflow-hidden rounded-xl transition-transform duration-400 hover:scale-102">
        <Image src="/image.png" alt="Banner" fill className="object-cover" />
      </div>
    </div>
  );
};

export default PromoBanner;
