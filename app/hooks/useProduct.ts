'use client';

import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  packaging?: string;
  rating?: number;
  reviews?: number;
  imageUrl?: string;
  category?: string;
  description?: string;
}

interface UseProductsProps {
  category?: string;
  limit?: number;
}

export function useProducts({ category, limit = 100 }: UseProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (limit) params.append('limit', limit.toString());

        // Hit the API endpoint which uses Redis cache
        const response = await fetch(`/api/products/featured?${params.toString()}`);
        
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, limit]);

  return { products, loading };
}