import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Product {
  id: number | string;
  name: string;
  image: string;
  category: string;
}
interface WishlistItem {
  productId: number | string;
}
export function useWishlist() {
  const [favorites, setFavorites] = useState<Set<number | string>>(new Set());

  useEffect(() => {
    const cached = localStorage.getItem('wishlist');
    if (cached) {
      setFavorites(new Set(JSON.parse(cached)));
    }

    const fetchWishlist = async () => {
      try {
        const res = await fetch('/api/account/wishlist');
        const data = await res.json();

        if (res.ok && Array.isArray(data)) {
          const favSet = new Set(data.map((item: WishlistItem) => item.productId));
          setFavorites(favSet);
          localStorage.setItem('wishlist', JSON.stringify([...favSet]));
        }
      } catch (error) {
        console.error('Wishlist fetch error:', error);
      }
    };

    fetchWishlist();
  }, []);

  const toggleFavorite = async (product: Product) => {
    if (favorites.has(product.id)) {
      // Optimistic update: remove from UI first
      setFavorites(prev => {
        const updated = new Set(prev);
        updated.delete(product.id);
        return updated;
      });

      try {
        const res = await fetch(`/api/account/wishlist?productId=${product.id}`, {
          method: 'DELETE',
        });
        const data = await res.json();

        if (!res.ok) {
          // rollback if failed
          setFavorites(prev => new Set(prev).add(product.id));
          toast.error(data.message || 'Could not remove from wishlist');
        } else {
          toast.success(data.message || 'Removed from wishlist');
        }
      } catch (err) {
        console.error('Somthing wents wrong:', err);
        setFavorites(prev => new Set(prev).add(product.id));
        toast.error('Network error — item not removed');
      }

      return;
    }

    // ADD TO WISHLIST
    try {
      const res = await fetch('/api/account/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: product.name,
          image_url: product.image,
          productId: product.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFavorites(prev => new Set(prev).add(product.id));
        toast.success(data.message || 'Added to wishlist');
      } else {
        toast.error(data.message || 'Already in wishlist');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error('Something went wrong. Please try again.', error);
    }
  };

  return {
    favorites,
    toggleFavorite,
  };
}
