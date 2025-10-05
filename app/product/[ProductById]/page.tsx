import Image from 'next/image';
import Navroute from '@/app/components/navroute';
import SimilarProductsSection from '@/app/components/SimilarProduct';

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
  productImages?: { id: string; url: string }[];
  productHighlights?: string;
  directionsForUse?: string;
  safetyInformation?: string;
  subCategory?: { id: string; name: string };
}

interface PackOption {
  quantity: number;
  price: number;
  perUnit: string;
  stock: string;
}

interface Props {
  params: { ProductById: string };
}

async function getProduct(productId: string): Promise<Product | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, {
    next: {
      revalidate: 6000
    }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.product || null;
}

async function getSimilarProducts(subCategoryId: string, productId: string): Promise<Product[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products?subCategoryId=${subCategoryId}&limit=10`, {
      next: {
        revalidate: 6000
      }
    });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.products || []).filter((p: Product) => p.id !== productId);
}

export default async function ProductDetailPage({ params }: Props) {
  const productId = params.ProductById;
  const productPromise = getProduct(productId);

  const product = await productPromise;
  let similarProducts: Product[] = [];
  if (product?.subCategory?.id) {
    similarProducts = await getSimilarProducts(product.subCategory.id, productId);
  }

  const sizes: string[] = ['Large', 'Small', 'Medium', 'New Born', 'XL', 'XXL'];
  const packOptions: PackOption[] = [
    { quantity: 96, price: 1270, perUnit: '₹13.32 Per Unit', stock: 'In Stock' },
    { quantity: 56, price: 970, perUnit: '₹11.32 Per Unit', stock: 'In Stock' },
    { quantity: 34, price: 770, perUnit: '₹9.32 Per Unit', stock: 'In Stock' },
    { quantity: 20, price: 270, perUnit: '₹5.32 Per Unit', stock: 'In Stock' },
  ];

  const selectedSize = sizes[0];
  const selectedPackIndex = 0;
  const quantity = 1;

  return (
    <>
      <Navroute />
      <div className="min-h-xl px-4 py-8">
        {!product ? (
          <p className="p-4 text-center">Product not found</p>
        ) : (
          <>
            <div>
              <div className="mx-auto grid w-[90%] max-w-7xl gap-6 rounded px-10 py-6 md:grid-cols-2">
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
                      <button className="px-2 text-2xl" disabled>
                        −
                      </button>
                      <span className="w-12 px-3 text-center">
                        {quantity.toString().padStart(2, '0')}
                      </span>
                      <button className="px-2 text-2xl" disabled>
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
                    className="flex w-52 items-center justify-center gap-2 rounded bg-[#317C80] py-3 font-medium text-white transition-transform duration-300 hover:scale-102"
                    disabled
                  >
                    <Image
                      src="/Vector.png"
                      alt="Cart"
                      width={100}
                      height={100}
                      className="h-5 w-5"
                    />
                    Add to Cart
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
              {similarProducts.length > 0 && <SimilarProductsSection products={similarProducts} />}
            </div>
          </>
        )}
      </div>
    </>
  );
}