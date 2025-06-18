import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { debounce } from 'lodash';

export type CartItemType = {
  id: string;
  productId?: string;
  medicineId?: string;
  quantity: number;
  addedAt: string;
  product?: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
  medicine?: {
    id: string;
    name: string;
    price: number;
    manufacturerName: string;
    packSizeLabel: string;
  };
};

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchCartItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cart');
      const data = await response.json();

      if (data.success) {
        setCartItems(data.cartItems);
      } else {
        toast.error('Failed to load cart items');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to load cart items');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const addToCart = async (item: { productId?: string; medicineId?: string; quantity?: number }) => {
    try {
      setIsUpdating(true);

      const tempId = `temp-${Date.now()}`;
      const placeholderItem: CartItemType = {
        id: tempId,
        quantity: item.quantity || 1,
        addedAt: new Date().toISOString(),
        ...(item.productId ? { productId: item.productId, product: { id: item.productId, name: 'Loading...', price: 0 } } : {}),
        ...(item.medicineId ? { medicineId: item.medicineId, medicine: { id: item.medicineId, name: 'Loading...', price: 0, manufacturerName: '', packSizeLabel: '' } } : {})
      };

      setCartItems(prev => [...prev, placeholderItem]);

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      const data = await response.json();

      setCartItems(prev => prev.filter(ci => ci.id !== tempId));

      if (data.success) {
        fetchCartItems();
        toast.success('Item added to cart');
      } else {
        toast.error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsUpdating(false);
    }
  };

  const debouncedUpdateCart = useCallback(
    debounce(async (id: string, quantity: number, optimisticId?: string) => {
      try {
        const response = await fetch(`/api/cart/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity }),
        });
        const data = await response.json();

        if (!data.success) {
          toast.error('Failed to update cart');
          if (optimisticId) fetchCartItems();
        }
      } catch (error) {
        console.error('Error updating cart:', error);
        toast.error('Failed to update cart');
        fetchCartItems();
      }
    }, 500),
    [fetchCartItems]
  );

  const updateCartItem = async (id: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );

    const optimisticId = `update-${Date.now()}`;
    debouncedUpdateCart(id, quantity, optimisticId);
  };

  const removeFromCart = async (id: string) => {
    try {
      const itemToRemove = cartItems.find(item => item.id === id);
      setCartItems(prev => prev.filter(item => item.id !== id));

      const response = await fetch(`/api/cart/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!data.success && itemToRemove) {
        setCartItems(prev => [...prev, itemToRemove]);
        toast.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      fetchCartItems();
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      const currentCart = [...cartItems];
      setCartItems([]);

      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
      });
      const data = await response.json();

      if (!data.success) {
        setCartItems(currentCart);
        toast.error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      fetchCartItems();
      toast.error('Failed to clear cart');
    }
  };

  return {
    cartItems,
    isLoading,
    isUpdating,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCartItems,
  };
}
