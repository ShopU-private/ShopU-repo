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
  return <HealthCategoryGrid title="Shop By Brand" healthCategories={brandData} />;
};

export default BrandSection;
