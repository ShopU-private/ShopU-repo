'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category?: string;
  rating?: number;
  reviews?: number;
  discount?: number;
  originalPrice?: number;
}

interface UseProductsOptions {
  category?: string;
  limit?: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams();
        if (options.category) queryParams.append('category', options.category);
        if (options.limit) queryParams.append('limit', options.limit.toString());

        const res = await fetch(`/api/products/featured?${queryParams.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch products');

        const data = await res.json();

        const transformed =
          data.products?.map(
            (product: any): Product => ({
              id: product.id,
              name: product.name,
              description: product.description,
              price: parseFloat(product.price?.toString() || '0'),
              stock: product.stock ?? 0,
              imageUrl: product.imageUrl || '/product-placeholder.jpg',
              category: product.subCategory?.name || 'Product',
              originalPrice: parseFloat(product.price?.toString() || '0') * 1.15,
              discount: 15,
              rating: 4.2,
              reviews: 12,
            })
          ) || [];

        setProducts(transformed);
      } catch (err) {
        console.error('Product fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options.category, options.limit]);

  return { products, loading, error };
}
