'use client';

import { useState, useEffect, useCallback } from 'react';
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

type Listener = () => void;

// Shared singleton state so multiple hook instances don't each fetch the cart
const shared = {
  cartItems: [] as CartItem[],
  isLoading: false,
  error: null as string | null,
  lastFetch: 0,
  listeners: new Set<Listener>(),
};

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

function notifyShared() {
  shared.listeners.forEach(l => l());
}

async function fetchCartItemsShared(forceRefresh = false) {
  try {
    if (!forceRefresh) {
      const cache = cartCache.get();
      if (cache && cartCache.isValid(cache.timestamp)) {
        shared.cartItems = cache.items;
        shared.isLoading = false;
        notifyShared();
        return;
      }
    }

    const now = Date.now();
    if (!forceRefresh && now - shared.lastFetch < 500) {
      return;
    }

    shared.lastFetch = now;
    shared.isLoading = true;
    shared.error = null;
    notifyShared();

    const response = await fetch('/api/cart', {
      headers: { 'Cache-Control': 'no-cache' },
    });

    if (response.status === 401) {
      shared.cartItems = [];
      shared.isLoading = false;
      notifyShared();
      return;
    }

    if (!response.ok) {
      console.error('Failed to fetch cart');
      shared.isLoading = false;
      notifyShared();
      return;
    }

    const data = await response.json();

    if (data.success && data.cartItems) {
      shared.cartItems = data.cartItems;
      cartCache.set(data.cartItems);
    } else {
      shared.error = data.error || 'Failed to fetch cart items';
      toast.error(shared.error);
    }
  } catch (err) {
    console.error('Error fetching cart:', err);
    const fallbackError = err instanceof Error ? err.message : 'Failed to fetch cart items';
    shared.error = fallbackError;
    toast.error(fallbackError);

    // fallback to cache
    const cache = cartCache.get();
    if (cache) {
      shared.cartItems = cache.items;
    }
  } finally {
    shared.isLoading = false;
    notifyShared();
  }
}

async function addItemShared(
  productId: string | null,
  medicineId: string | null,
  quantity: number
) {
  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, medicineId, quantity }),
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
      // Update shared state optimistically
      const existingIndex = shared.cartItems.findIndex(
        item =>
          (productId && item.productId === productId) ||
          (medicineId && item.medicineId === medicineId)
      );

      if (existingIndex >= 0) {
        shared.cartItems[existingIndex] = {
          ...shared.cartItems[existingIndex],
          quantity: shared.cartItems[existingIndex].quantity + quantity,
        } as CartItem;
      } else {
        shared.cartItems = [...shared.cartItems, data.cartItem];
      }

      cartCache.set(shared.cartItems);
      notifyShared();

      // Refresh to ensure server consistency
      setTimeout(() => fetchCartItemsShared(true), 300);

      return data.cartItem;
    } else {
      toast.error(data.error || 'Failed to add item to cart');
      return null;
    }
  } catch (err) {
    console.error('Error adding item to cart:', err);
    toast.error('Something went wrong while adding to cart');
    return null;
  }
}

async function updateQuantityShared(itemId: string, quantity: number) {
  try {
    const originalItems = [...shared.cartItems];
    shared.cartItems = shared.cartItems.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    notifyShared();

    const response = await fetch(`/api/cart/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      shared.cartItems = originalItems;
      notifyShared();
      toast.error(data.error || 'Failed to update item quantity');
      return;
    }

    cartCache.set(shared.cartItems);
    await fetchCartItemsShared(true);
    window.dispatchEvent(new CustomEvent('cartCountUpdated'));
    toast.success('Cart updated!');
  } catch (err) {
    console.error('Error updating item quantity:', err);
    shared.error = err instanceof Error ? err.message : 'Failed to update item quantity';
    notifyShared();
    toast.error('Something went wrong while updating the cart');
  }
}

async function removeItemShared(itemId: string) {
  try {
    const originalItems = [...shared.cartItems];
    shared.cartItems = shared.cartItems.filter(item => item.id !== itemId);
    notifyShared();

    const response = await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
    const data = await response.json();

    if (!response.ok || !data.success) {
      shared.cartItems = originalItems;
      notifyShared();
      toast.error(data.error || 'Failed to remove item from cart');
      return null;
    }

    cartCache.set(shared.cartItems);
    await fetchCartItemsShared(true);
    window.dispatchEvent(new CustomEvent('cartCountUpdated'));
    return true;
  } catch (err) {
    console.error('Error removing item from cart:', err);
    shared.error = 'Failed to remove item from cart';
    notifyShared();
    toast.error('Something went wrong while removing from cart');
    return null;
  }
}

async function clearCartShared() {
  try {
    shared.error = null;
    shared.cartItems = [];
    cartCache.set([]);
    notifyShared();

    const response = await fetch('/api/cart/clear', { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json();
      console.error('Error clearing cart:', data.error);
    }
    await fetchCartItemsShared(true);
    window.dispatchEvent(new CustomEvent('cartCountUpdated'));
  } catch (err) {
    console.error('Error clearing cart:', err);
  }
}

// Initialize: no fetch here; first subscriber will trigger load

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(shared.cartItems);
  const [isLoading, setIsLoading] = useState<boolean>(shared.isLoading);
  const [error, setError] = useState<string | null>(shared.error);

  useEffect(() => {
    const listener: Listener = () => {
      setCartItems(shared.cartItems);
      setIsLoading(shared.isLoading);
      setError(shared.error);
    };

    // sync current values
    listener();

    shared.listeners.add(listener);

    // first subscriber triggers fetch
    if (shared.listeners.size === 1) {
      // dont await
      fetchCartItemsShared();
    }

    // also listen for custom events from other parts of the app
    const handleCartUpdate = () => fetchCartItemsShared(true);
    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      shared.listeners.delete(listener);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const addItem = useCallback(
    (productId: string | null, medicineId: string | null, quantity: number) => {
      return addItemShared(productId, medicineId, quantity);
    },
    []
  );

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    return updateQuantityShared(itemId, quantity);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    return removeItemShared(itemId);
  }, []);

  const clearCart = useCallback(() => {
    return clearCartShared();
  }, []);

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

  const totals = {
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: cartItems.reduce((sum, item) => {
      const price = Number(item.product?.price || item.medicine?.price || 0);
      return sum + price * item.quantity;
    }, 0),
  };

  return {
    cartItems,
    isLoading,
    error,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    addToCart,
    refreshCart: (force = false) => fetchCartItemsShared(force),
    totals,
  };
}
