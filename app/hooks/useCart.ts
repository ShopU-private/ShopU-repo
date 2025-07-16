'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Product = {
  id: string;
  name: string;
  price: number | string;
  imageUrl?: string;
};

type Medicine = {
  id: string;
  name: string;
  price: number | string;
  manufacturerName?: string;
  packSizeLabel?: string;
};

type CartItem = {
  id: string;
  quantity: number;
  product?: Product;
  medicine?: Medicine;
  productId?: string;
  medicineId?: string;
  combinationId?: string;
  addedAt: string;
};

// Cache key for local storage
const CART_CACHE_KEY = 'shop_u_cart_cache';
const CART_CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  // Helper for local storage operations
  const cartCache = {
    get: (): { items: CartItem[]; timestamp: number } | null => {
      try {
        const cached = localStorage.getItem(CART_CACHE_KEY);
        return cached ? JSON.parse(cached) : null;
      } catch (e) {
        console.warn('Failed to retrieve cart cache', e);
        return null;
      }
    },
    set: (items: CartItem[]) => {
      try {
        localStorage.setItem(CART_CACHE_KEY, JSON.stringify({ items, timestamp: Date.now() }));
      } catch (e) {
        console.warn('Failed to save cart cache', e);
      }
    },
    isValid: (timestamp: number) => {
      return Date.now() - timestamp < CART_CACHE_TTL;
    },
  };

  // Fetch cart items from API with debounce logic
  const fetchCartItems = useCallback(
    async (forceRefresh = false) => {
      try {
        // Use cache if available and not forcing refresh
        if (!forceRefresh) {
          const cache = cartCache.get();
          if (cache && cartCache.isValid(cache.timestamp)) {
            setCartItems(cache.items);
            setIsLoading(false);
            return;
          }
        }

        // Don't fetch more than once every 500ms unless forced
        const now = Date.now();
        if (!forceRefresh && now - lastFetch < 500) {
          return;
        }

        setLastFetch(now);
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/cart', {
          headers: { 'Cache-Control': 'no-cache' },
        });

        if (response.status === 401) {
          // User not logged in
          setCartItems([]);
          setIsLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch cart');
        }

        const data = await response.json();
        if (data.success && data.cartItems) {
          setCartItems(data.cartItems);
          // Update cache
          cartCache.set(data.cartItems);
        } else {
          throw new Error(data.error || 'Failed to fetch cart items');
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch cart items');

        // Use cached data as fallback if available
        const cache = cartCache.get();
        if (cache) {
          setCartItems(cache.items);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [lastFetch]
  );

  // Initialize cart on component mount
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      fetchCartItems(true);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [fetchCartItems]);

  // Add item to cart
  const addItem = useCallback(
    async (productId: string | null, medicineId: string | null, quantity: number) => {
      try {
        setError(null);

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

        if (response.status === 401) {
          toast.error('Please login to add items to cart');
          return null;
        }

        if (!response.ok) {
          toast.error(data.error || 'Failed to add item to cart');
          return null;
        }

        if (data.success && data.cartItem) {
          setCartItems(prev => {
            const existingIndex = prev.findIndex(
              item =>
                (productId && item.productId === productId) ||
                (medicineId && item.medicineId === medicineId)
            );

            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = {
                ...updated[existingIndex],
                quantity: updated[existingIndex].quantity + quantity,
              };
              return updated;
            } else {
              return [...prev, data.cartItem];
            }
          });

          // Update cache
          const updatedItems = [...cartItems];
          cartCache.set(updatedItems);

          // Optional refresh
          setTimeout(() => fetchCartItems(true), 300);

          toast.success('Item added to cart');
          return data.cartItem;
        } else {
          toast.error(data.error || 'Failed to add item to cart');
          return null;
        }
      } catch (err) {
        console.error('Error adding item to cart:', err);
        setError('Something went wrong while adding to cart');
        toast.error('Something went wrong while adding to cart');
        return null;
      }
    },
    [cartItems, fetchCartItems]
  );

  // Update item quantity with optimistic updates
  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        setError(null);

        // Optimistic update
        const originalItems = [...cartItems];
        const updatedItems = cartItems.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );

        setCartItems(updatedItems);

        const response = await fetch(`/api/cart/${itemId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity }),
        });

        if (!response.ok) {
          // Revert on error
          setCartItems(originalItems);
          const data = await response.json();
          throw new Error(data.error || 'Failed to update item quantity');
        }

        const data = await response.json();
        if (data.success) {
          // Update cache
          cartCache.set(updatedItems);
        } else {
          // Revert on error
          setCartItems(originalItems);
          throw new Error(data.error || 'Failed to update item quantity');
        }
      } catch (err) {
        console.error('Error updating item quantity:', err);
        setError(err instanceof Error ? err.message : 'Failed to update item quantity');
        throw err;
      }
    },
    [cartItems]
  );

  // Remove item from cart with optimistic updates
  const removeItem = useCallback(
    async (itemId: string) => {
      try {
        setError(null);

        // Optimistic update
        const originalItems = [...cartItems];
        const updatedItems = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedItems);

        const response = await fetch(`/api/cart/${itemId}`, {
          method: 'DELETE',
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          // Revert on error
          setCartItems(originalItems);
          toast.error(data.error || 'Failed to remove item from cart');
          return null;
        }

        // Update cache on success
        cartCache.set(updatedItems);
        toast.success('Item removed from cart');
        return true;
      } catch (err) {
        console.error('Error removing item from cart:', err);
        setError('Failed to remove item from cart');
        toast.error('Something went wrong while removing from cart');
        return null;
      }
    },
    [cartItems]
  );

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      setError(null);

      // Optimistic update
      setCartItems([]);
      cartCache.set([]);

      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Error clearing cart:', data.error);
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  }, []);

  // Legacy support for components using addToCart instead of addItem
  const addToCart = useCallback(
    ({
      productId,
      medicineId,
      quantity = 1,
    }: {
      productId?: string;
      medicineId?: string;
      quantity?: number;
    }) => {
      return addItem(productId || null, medicineId || null, quantity);
    },
    [addItem]
  );

  // Calculate cart totals once per cartItems change
  const totals = useMemo(() => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => {
      const price = Number(item.product?.price || item.medicine?.price || 0);
      return sum + price * item.quantity;
    }, 0);

    return {
      itemCount,
      subtotal,
    };
  }, [cartItems]);

  return {
    cartItems,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    addToCart,
    refreshCart: (force = false) => fetchCartItems(force),
    totals,
  };
}
