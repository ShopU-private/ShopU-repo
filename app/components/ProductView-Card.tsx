import react from 'react';
import { ProductType } from '../types/ProductTypes';

const ProductCard = ({ item }: { item: ProductType }) => {
  return (
    <div className="rounded-lg h-[280px] bg-white p-3 shadow-lg transition hover:shadow-md">
      <img
        src={
          'https://onemg.gumlet.io/l_watermark_346,w_120,h_120/a_ignore,w_120,h_120,c_fit,q_auto,f_auto/a46cba5a96a244a781a955ccf41972f1.jpg'
        }
        alt={item.title}
        className="mb-2 h-28 w-full object-contain"
      />


        <h3 className='mb-1 text-sm font-semibold line-clamp-2'>{"Hamdard Joshina Herbal Cough & Cold Syrup | Non-Drowsy Formula & No Alcohol"}</h3>  
          <p className="text-sm text-black">{"Bottle of 100ml Syrup"}</p>
        <br />
        <div className='flex items-center gap-2'>
          <p className="text-sm text-black line-through">MRP ₹{145}</p>
          <p className='text-sm font-bold text-red-500'>{50}%OFF</p>
          <br />
        </div>
          <p className='text-lg font-bold text-[#317c80]'> ₹ {128}</p>
    </div>
  );
};

export default ProductCard;
