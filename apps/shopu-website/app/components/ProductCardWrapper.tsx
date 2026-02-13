import { ProductCardWrapperProps } from '@shopu/types-store/types';
import ProductCard from './ProductCard';

export default function ProductCardWrapper({
  product,
  favorites,
  toggleFavorite,
  handleAddToCart,
  addingProductId,
}: ProductCardWrapperProps) {
  return (
    <ProductCard
      product={{
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount ?? 20,
        stock: product.stock,
        packaging: product.packaging,
        rating: product.rating ?? 4.5,
        reviews: product.reviews ?? 100,
        imageUrl: product.imageUrl ?? '/product-placeholder.jpg',
        category: product.category ?? 'Product',
        subtitle: product.description,
      }}
      isFavorite={favorites.has(product.id)}
      onToggleFavorite={() =>
        toggleFavorite({
          id: product.id,
          name: product.name,
          image: product.imageUrl ?? '/product-placeholder.jpg',
          category: product.category ?? 'Product',
        })
      }
      onAddToCart={() => handleAddToCart(product.id)}
      isAdding={addingProductId === product.id}
    />
  );
}
