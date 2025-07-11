import react from 'react';
import { ProductType } from '../types/ProductTypes';

const ProductCard = ({ item }: { item: ProductType }) => {
  return (
    <div className="rounded border bg-white p-3 shadow-sm">
      <img
        src={
          'https://durotuss.com.au/wp-content/uploads/2022/03/95800_DT_RELIEF-COLD_FLU-LIQ-200ML_Front_V0.png'
        }
        alt={item.title}
        className="mb-2 h-28 w-full object-contain"
      />

      <p className="text-sm text-red-500">{'50%'}</p>
      <h3 className="mb-1 line-clamp-2 text-sm font-semibold break-words whitespace-normal">
        {'95800_DT_RELIEF-COLD_FLU-LIQ-200M'}
      </h3>
      <p className="text-lg font-bold text-[#317C80]">{500}</p>
      <p className="text-sm text-gray-500 line-through">{730}</p>
      <p className="text-sm text-red-500">{'50%'}</p>
    </div>
  );
};

export default ProductCard;
