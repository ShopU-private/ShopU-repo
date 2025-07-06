import react from 'react';
import { ProductType } from '../types/ProductType';

const ProductCard = ({ item }: { item: ProductType }) => {
  return (
    <div className="rounded border bg-white p-3 shadow-sm">
      <img src={item.image} alt={item.title} className="mb-2 h-28 w-full object-contain" />

      <h3 className="mb-1 line-clamp-2 text-sm font-semibold">{item.title}</h3>
      <p className="text-sm font-bold text-[#317C80]">{item.price}</p>
      <p className="text-xs text-gray-500 line-through">{item.mrp}</p>
      <p className="text-xs text-red-500">{item.discount}</p>
    </div>
  );
};

export default ProductCard;
