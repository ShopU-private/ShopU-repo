'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Navroute from '@/app/components/navroute';
import { Loader } from 'lucide-react';
import SimilarProductsSection from '@/app/components/SimilarProduct';
import useAddToCart from '@/app/hooks/handleAddToCart';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  imageUrl: string;
  category: string;
  subtitle?: string;
  stock: number;
  description?: string;

  // optional richer fields for detail page
  productImages?: { id: string; url: string }[];
  productHighlights?: string;
  directionsForUse?: string;
  safetyInformation?: string;
}

interface PackOption {
  quantity: number;
  price: number;
  perUnit: string;
  stock: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.ProductById as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleAddToCart, addingProductId } = useAddToCart();

  useEffect(() => {
    if (!productId) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (!res.ok) toast.error(data.error || 'Failed to fetch product');
        setProduct(data.product);

        if (data.product?.subCategory?.id) {
          const simRes = await fetch(
            `/api/products?subCategoryId=${data.product.subCategory.id}&limit=10`
          );
          const simData = await simRes.json();
          if (simRes.ok) {
            setSimilarProducts(simData.products.filter((p: Product) => p.id !== productId));
          }
        }
      } catch (err) {
        console.error('Product fetch error:', err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const [selectedSize, setSelectedSize] = useState<string>('Large');
  const sizes: string[] = ['Large', 'Small', 'Medium', 'New Born', 'XL', 'XXL'];
  const [selectedPackIndex, setSelectedPackIndex] = useState<number>(0);
  const packOptions: PackOption[] = [
    { quantity: 96, price: 1270, perUnit: '₹13.32 Per Unit', stock: 'In Stock' },
    { quantity: 56, price: 970, perUnit: '₹11.32 Per Unit', stock: 'In Stock' },
    { quantity: 34, price: 770, perUnit: '₹9.32 Per Unit', stock: 'In Stock' },
    { quantity: 20, price: 270, perUnit: '₹5.32 Per Unit', stock: 'In Stock' },
  ];

  const [quantity, setQuantity] = useState(1);
  const handleDecrement = () => quantity > 1 && setQuantity(quantity - 1);
  const handleIncrement = () => setQuantity(quantity + 1);

  return (
    <>
      <Navroute />
      <div className="min-h-xl px-4 py-8">
        {loading ? (
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="text-center">
              <Loader className="mx-auto h-8 w-8 animate-spin text-teal-600" />
              <p className="mt-4 text-gray-600">Loading product...</p>
            </div>
          </div>
        ) : error ? (
          <p className="p-4 text-red-500">{error}</p>
        ) : !product ? (
          <p className="p-4 text-center">Product not found</p>
        ) : (
          <>
            <div className="">
              <div className="mx-auto grid w-[90%] max-w-7xl gap-6 rounded px-10 py-6 md:grid-cols-2">
                {/* Left: Image Gallery */}
                <div className="flex gap-6">
                  <div className="flex flex-1 items-center justify-center rounded-lg bg-white p-12">
                    <Image
                      src={product.imageUrl || '/placeholder.png'}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-84 object-contain p-8 transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{product.name}</h2>

                  <div>
                    <p className="my-2 text-sm font-medium">Select Sizes</p>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`cursor-pointer rounded px-5 py-2 text-sm transition ${
                            selectedSize === size
                              ? 'bg-[#317C80] text-white'
                              : 'bg-[#D9D9D9] text-black'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="w-[90%] pb-2">
                    <p className="mt-4 mb-2 text-sm font-medium">Select Pack Sizes :</p>
                    <div className="flex grid-cols-2 gap-3 space-x-4 overflow-x-auto sm:grid sm:grid-cols-4 sm:space-x-0">
                      {packOptions.map((pack, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedPackIndex(index)}
                          className={`cursor-pointer rounded transition ${
                            selectedPackIndex === index
                              ? 'bg-[#317C80] text-white'
                              : 'bg-[#D9D9D9] text-black'
                          }`}
                        >
                          <p className="p-2 text-sm">{pack.quantity}</p>
                          <hr />
                          <div className="p-2">
                            <p className="text-md mb-2 font-semibold">₹{pack.price}</p>
                            <p className="mb-2 text-xs">({pack.perUnit})</p>
                            <p className="text-xs">{pack.stock}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="items-center gap-4">
                    <div className="my-4 flex w-28 items-center rounded border px-2">
                      <button onClick={handleDecrement} className="px-2 text-2xl">
                        −
                      </button>
                      <span className="w-12 px-3 text-center">
                        {quantity.toString().padStart(2, '0')}
                      </span>
                      <button onClick={handleIncrement} className="px-2 text-2xl">
                        +
                      </button>
                    </div>
                    <div className="flex">
                      <p className="mr-2 text-xl font-semibold text-[#317C80]">₹{product.price}</p>
                      <p className="mt-2 text-sm text-gray-500">
                        <span className="line-through">MRP: ₹1270</span>{' '}
                        <span className="text-green-600">10% OFF</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(productId)}
                    disabled={addingProductId === productId}
                    className="flex w-52 items-center justify-center gap-2 rounded bg-[#317C80] py-3 font-medium text-white transition-transform duration-300 hover:scale-102"
                  >
                    {addingProductId === productId ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <Image
                          src="/Vector.png"
                          alt="Cart"
                          width={100}
                          height={100}
                          className="h-5 w-5"
                        />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-md mx-auto w-[90%] max-w-7xl p-8 leading-relaxed text-gray-800">
                {product.description && (
                  <section className="mb-6">
                    <h2 className="mb-2 text-xl font-semibold">Description</h2>
                    <p className="pl-4">{product.description}</p>
                  </section>
                )}
                {product.directionsForUse && (
                  <section className="mb-6">
                    <h2 className="mb-2 text-xl font-semibold">Directions for Use</h2>
                    <p className="pl-4 whitespace-pre-line">{product.directionsForUse}</p>
                  </section>
                )}
                {product.safetyInformation && (
                  <section>
                    <h2 className="mb-2 text-xl font-semibold">Safety Information</h2>
                    <p className="pl-4 whitespace-pre-line">{product.safetyInformation}</p>
                  </section>
                )}
              </div>

              {/* ===== Similar Products Section ===== */}
              {similarProducts.length > 0 && <SimilarProductsSection products={similarProducts} />}
            </div>
          </>
        )}
      </div>
    </>
  );
}
