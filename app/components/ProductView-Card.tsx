import React, { useState } from 'react';
import { ProductType } from '../types/ProductTypes';
import { motion, AnimatePresence } from "framer-motion";

const ProductCard = ({ item }: { item: ProductType }) => {
  const [quantity, setQuantity] = useState(0);

  const handleAdd = () => setQuantity(1);
  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => {
    if (quantity === 1) setQuantity(0);
    else setQuantity(prev => prev - 1);
  };

  return (
    <div className="group rounded-lg h-[280px] bg-white p-3 shadow-lg transition hover:shadow-md">
      {/* Product Card Image */}
      <img
        src="https://onemg.gumlet.io/l_watermark_346,w_120,h_120/a_ignore,w_120,h_120,c_fit,q_auto,f_auto/a46cba5a96a244a781a955ccf41972f1.jpg"
        alt={item.title}
        className="mb-2 h-28 w-full object-contain"
      />
      {/* Product Title */}
      <h3 className="mb-1 text-sm font-semibold line-clamp-2">
        Hamdard Joshina Herbal Cough & Cold Syrup | Non-Drowsy Formula & No Alcohol
      </h3>
      {/* Product Quantity */}
      <p className="text-sm text-black">Bottle of 100ml Syrup</p>

      {/* Product MRP & Discount */}
      <div className="flex items-center gap-2 mt-2">
        <p className="text-sm text-black line-through">MRP ₹145</p>
        <p className="text-sm font-bold text-red-500">50% OFF</p>
      </div>

      {/* Product Price & Add*/}
      <div className="flex items-center justify-between mt-2">
        <p className="text-lg font-bold text-[#317c80]">₹130</p>

        <motion.div
          className={`relative rounded border-2 border-[#317c80] px-3 py-0.5 text-md font-bold text-[#317c80] transition-all duration-300 overflow-hidden
          ${quantity === 0 ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}

        >
          <div className="flex items-center justify-center gap-2 relative">
            <AnimatePresence initial={false} mode="wait">
              {quantity === 0 ? (
                <motion.button
                  key="add"
                  onClick={handleAdd}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  ADD
                </motion.button>
              ) : (
                <motion.div
                  key="counter"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <button 
                  className='font-bold text-lg'
                  onClick={handleDecrement}>-</button>
                  <span>{quantity}</span>
                  <button onClick={handleIncrement}>+</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductCard;