'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  productId?: string;
  medicineId?: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  medicine?: {
    id: string;
    name: string;
    price: number;
    manufacturerName: string;
    packSizeLabel: string;
  };
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/cart');
      const data = await response.json();

      if (data.success) {
        setCartItems(data.cartItems || []);
      } else {
        // If unauthorized, we don't want to show an error as the user might not be logged in
        if (response.status === 401) {
          setCartItems([]);
        } else {
          console.error('Failed to fetch cart:', data.error);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity < 1) {
        return removeItem(itemId);
      }

      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      const data = await response.json();

      if (data.success) {
        setCartItems(prevItems =>
          prevItems.map(item => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
        );
      } else {
        console.error('Failed to update item quantity:', data.error);
      }
    } catch (error) {
      console.error('Error updating item quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
      } else {
        console.error('Failed to remove item:', data.error);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const addItem = async (productId: string | null = null, medicineId: string | null = null, quantity: number = 1) => {
    try {
      if (!productId && !medicineId) {
        throw new Error('Either product ID or medicine ID is required');
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          medicineId,
          quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Refresh cart after adding item
        fetchCart();
        return true;
      } else {
        console.error('Failed to add item to cart:', data.error);
        if (response.status === 401) {
          // Redirect to login if unauthorized
          router.push('/login');
        }
        return false;
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      return false;
    }
  };
  
  // Add clear cart function
  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setCartItems([]);
        return true;
      } else {
        console.error('Failed to clear cart:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  };

  return {
    cartItems,
    isLoading,
    addItem,
    updateQuantity,
    removeItem,
    fetchCart,
    clearCart
  };
}
    
