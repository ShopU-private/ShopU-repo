import React from 'react';
import { Tag, RotateCcw, Truck } from 'lucide-react';

const FeatureCards = () => {
  const features = [
    {
      icon: <Tag className="w-6 h-6 text-gray-700" />,
      title: 'Best Prices & Deals',
      desc: 'Don’t miss our daily amazing deals and prices',
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-gray-700" />,
      title: 'Refundable',
      desc: 'If your items have damage we agree to refund it',
    },
    {
      icon: <Truck className="w-6 h-6 text-gray-700" />,
      title: 'Fast delivery',
      desc: 'Get your order delivered in minutes – fast, fresh, and right at your door!',
    },
  ];

  return (
    <section className="px-4 sm:px-8 md:px-16 py-8 sm:py-8 bg-[#EFEFEF] ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {features.map((item, index) => (
          <div key={index} className="flex items-start gap-4 text-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
              {item.icon}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
