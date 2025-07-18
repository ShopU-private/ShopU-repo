'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const SpecialOffers = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <section className="py-8 px-4 max-w-7xl mx-auto w-[90%]">
        <h2 className="text-primaryColor mb-4 text-xl font-semibold sm:text-xl">
          Special <span className="text-secondaryColor">Offer</span>
          <hr className="bg-background1 mt-1 h-1 w-24 rounded border-0" />{' '}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>
          <div className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 max-w-7xl mx-auto w-[90%]">
      <h2 className="text-primaryColor mb-6 text-xl font-semibold sm:text-xl">
        Special <span className="text-secondaryColor">Offer</span>
        <hr className="bg-background1 mt-1 h-1 w-32 rounded border-0" />{' '}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        {/* Covid Pack */}
        <div
          className="bg-background rounded-xl px-8 py-10 flex bg-cover bg-right h-64 transition-transform duration-400 hover:scale-102"
          style={{ backgroundImage: `url('/covid.jpg')` }}
        >
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Covid 19 pack</h3>
            <p className="text-gray-800 mb-6 font-semibold text-xl">Get it now 45% Off</p>
            <button className="bg-background1 text-white px-4 py-2 rounded-full text-sm">
              Show now →
            </button>
          </div>
        </div>
        {/* Moov Cream */}
        <div className="bg-gradient-to-r from-[#6A1B6A] to-[#E72386] rounded-xl py-6 px-10 flex justify-between items-center text-white h-64 transition-transform duration-400 hover:scale-102">
          <div>
            <h3 className="text-2xl font-semibold mb-2">
              Moov Fast Pain<br />Relief Cream
            </h3>
            <p className="text-sm mb-4">
              Quick Pain Relief From Muscle Pain,<br />
              Sprains, Strains, Spasms and even cramps
            </p>
            <button className="bg-white text-[#7E067E] px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition">
              Show now →
            </button>
          </div>
          <div className="flex flex-col justify-center items-end ">
            <Image
              src="/moov.png"
              alt="Moov Cream"
              width={130}
              height={40}
              className="object-contain hidden md:block"
            />
            <Image
              src="/moov.png"
              alt="Moov Cream"
              width={130}
              height={40}
              className="object-contain hidden md:block"
            />
            <Image
              src="/moov.png"
              alt="Moov Cream"
              width={130}
              height={40}
              className="object-contain hidden md:block"
            />

          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
