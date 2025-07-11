import React from 'react';

const brandData = [
  { id: 'himalaya', name: 'Himalaya', image: '/himalaya.png' },
  { id: 'nivea', name: 'Nivea', image: '/nivea1.png' },
  { id: 'aveeno', name: 'Aveeno', image: '/aveeno.png' },
  { id: 'volini', name: 'Volini', image: '/volini.png' },
  { id: 'revital', name: 'Revital', image: '/revital.png' },
  { id: 'mamypoko', name: 'Mamypoko', image: '/manypoko.png' },
];

const BrandSection = () => {
  return (
    <div className="justify-cente flex bg-white px-4 py-2">
      <section className="mx-auto w-[90%] max-w-7xl py-2">
        <div className="w-36">
          <h2 className="text-primaryColor text-xl font-semibold sm:text-xl">
            Shop By <span className="text-secondaryColor">Brand</span>
          </h2>
          <hr className="bg-background1 mt-1 h-1 rounded border-0" />
        </div>

        <div className="grid grid-cols-2 gap-4 py-6 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {brandData.map(category => (
            <div
              key={category.id}
              className="group bg-background flex items-center justify-center rounded-lg p-6"
            >
              <img
                src={category.image}
                alt={category.name}
                className="rounded-lg object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BrandSection;
