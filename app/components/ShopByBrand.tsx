import React from 'react';
import HealthCategoryGrid from './HealthCategoryGrid';

const brandData = [
  { id: 'himalaya', name: 'Himalaya', icon: '🌿' }, // Natural care
  { id: 'nivea', name: 'Nivea', icon: '🧴' }, // Skin lotion
  { id: 'aveeno', name: 'Aveeno', icon: '🌾' }, // Oat-based skincare
  { id: 'volini', name: 'Volini', icon: '💪' }, // Muscle pain relief
  { id: 'revital', name: 'Revital', icon: '💊' }, // Supplement
  { id: 'pain-relief', name: 'Pain Relief', icon: '🩹' }, // General pain relief
  { id: 'mamypoko', name: 'Mamypoko', icon: '🍼' }, // Baby products
];

const BrandSection = () => {
<<<<<<< HEAD
  return <HealthCategoryGrid title="Shop By Brand" healthCategories={brandData} />;
=======
  return (
    <div className='max-w-7xl mx-auto px-4 py-6 w-[90%]'>
    <HealthCategoryGrid
      title="Shop By "
      title1='Brand'
      healthCategories={brandData}
    />
    </div>

  );
>>>>>>> f6a1dc91063cebddc87d89c36f350f5a8279f26f
};

export default BrandSection;
