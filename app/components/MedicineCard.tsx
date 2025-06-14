//card for testing

import React from 'react';

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface MedicineCardProps {
  medicine: Medicine;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <h3 className="mb-2 text-lg font-semibold text-gray-800">{medicine.name}</h3>
      <p className="mb-3 line-clamp-2 text-sm text-gray-600">{medicine.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-teal-600">₹{medicine.price}</span>
        <button className="rounded-md bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const searchEventEmitter = {
  listeners: new Set<(results: Medicine[]) => void>(),
  emit(results: Medicine[]) {
    this.listeners.forEach(listener => listener(results));
  },
  subscribe(listener: (results: Medicine[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },
};

export { searchEventEmitter };
export default MedicineCard;
