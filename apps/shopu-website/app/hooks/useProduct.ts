'use client';

import { Product, RawProduct, UseProductsOptions } from '@shopu/types-store/types';
import { useState, useEffect } from 'react';

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(options.page || 1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (options.category) queryParams.append('category', options.category);
        if (options.limit) queryParams.append('limit', options.limit.toString());
        if (options.page) queryParams.append('page', options.page.toString());

        const res = await fetch(`/api/products/featured?${queryParams.toString()}`);

        if (!res.ok) {
          console.log('Failed to fetch products');
        }
        const data = await res.json();

        const transformed =
          data.products?.map(
            (product: RawProduct): Product => ({
              id: product.id,
              name: product.name,
              description: product.description,
              price: parseFloat(product.price?.toString() || '0'),
              stock: product.stock ?? 0,
              imageUrl: product.imageUrl || '/product-placeholder.jpg',
              category: product.subCategory?.name || 'Product',
              originalPrice:
                product.originalPrice ?? parseFloat(product.price?.toString() || '0') * 1.15,
              discount: product.discount ?? 15,
              packaging: product.packaging || 'Standard Packaging',
              rating: 4.2,
              reviews: 12,
            })
          ) || [];

        setProducts(transformed);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      } catch (err) {
        console.error('Product fetch error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [options.category, options.limit, options.page]);

  return { products, loading, error, totalPages, currentPage };
}
