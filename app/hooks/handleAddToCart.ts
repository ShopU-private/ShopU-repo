// hooks/useAddToCart.ts
import { useState } from 'react';
import { useCart } from '../hooks/useCart';

const useAddToCart = () => {
  const [addingProductId, setAddingProductId] = useState<number | string | null>(null);
  const { addItem } = useCart();

  const handleAddToCart = async (productId: string) => {
    setAddingProductId(productId);
    try {
      await addItem(productId, null, 1);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Add to cart failed:', error);
    } finally {
      setAddingProductId(null);
    }
  };

  return {
    handleAddToCart,
    addingProductId,
  };
};

export default useAddToCart;
