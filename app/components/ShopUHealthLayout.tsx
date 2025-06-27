// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { useCart } from '../hooks/useCart';
// import ProductCard from '../components/ProductCard'; 

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   originalPrice?: number;
//   discount?: number;
//   rating: number;
//   reviews: number;
//   image: string;
//   category: string;
// }

// interface HealthCategory {
//   id: string;
//   name: string;
//   icon: string;
// }

// const ShopUHealthComponent: React.FC = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [favorites, setFavorites] = useState<Set<number>>(new Set());
//   const [visibleCards, setVisibleCards] = useState(1);
//   const { addToCart } = useCart();
//   const [addingProductId, setAddingProductId] = useState<number | null>(null);

//   const healthCategories: HealthCategory[] = [
//     { id: 'diabetes', name: 'Diabetes Care', icon: '🩺' },
//     { id: 'cardiac', name: 'Cardiac Care', icon: '❤️' },
//     { id: 'elderly', name: 'Elderly Care', icon: '👴' },
//     { id: 'oral', name: 'Oral Care', icon: '🦷' },
//     { id: 'stomach', name: 'Stomach Care', icon: '🫁' },
//     { id: 'pain', name: 'Pain Relief', icon: '💊' },
//     { id: 'liver', name: 'Liver Care', icon: '🫀' },
//   ];

//   const products: Product[] = [
//     {
//       id: 1,
//       name: 'Cofsils Gargle (Buy 1 Get 1 FREE)',
//       price: 130,
//       originalPrice: 260,
//       discount: 50,
//       rating: 4.5,
//       reviews: 124,
//       image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop',
//       category: 'Oral Care',
//     },
//     {
//       id: 2,
//       name: 'She Need Hair Supplement with Folic Acid',
//       price: 165,
//       originalPrice: 275,
//       discount: 40,
//       rating: 4.3,
//       reviews: 89,
//       image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
//       category: 'Hair Care',
//     },
//     {
//       id: 3,
//       name: 'Easylax L Oral Solution Lemon Sugar Free',
//       price: 125,
//       originalPrice: 165,
//       discount: 24,
//       rating: 4.2,
//       reviews: 67,
//       image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop',
//       category: 'Digestive Health',
//     },
//     {
//       id: 4,
//       name: 'Combo Pack of Tata 1mg Pain Relief Spray',
//       price: 51,
//       originalPrice: 88,
//       discount: 46,
//       rating: 4.6,
//       reviews: 203,
//       image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop',
//       category: 'Pain Relief',
//     },
//     {
//       id: 5,
//       name: 'Prega News Advance Pregnancy Rapid Test Kit',
//       price: 194,
//       originalPrice: 225,
//       discount: 20,
//       rating: 4.8,
//       reviews: 312,
//       image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=300&h=300&fit=crop',
//       category: "Women's Health",
//     },
//   ];

//   const toggleFavorite = (productId: number) => {
//     setFavorites((prev) => {
//       const updated = new Set(prev);
//       if (updated.has(productId)) {
//         updated.delete(productId);
//       } else {
//         updated.add(productId);
//       }
//       return updated;
//     });
//   };

//   const handleAddToCart = async (product: Product) => {
//     setAddingProductId(product.id);
//     try {
//       await addToCart({ productId: product.id.toString(), quantity: 1 });
//       window.dispatchEvent(new CustomEvent('cartUpdated'));
//     } catch (error) {
//       console.error('Add to cart failed:', error);
//     } finally {
//       setAddingProductId(null);
//     }
//   };

//   useEffect(() => {
//     const updateVisibleCards = () => {
//       if (window.innerWidth < 640) setVisibleCards(1);
//       else if (window.innerWidth < 1024) setVisibleCards(2);
//       else if (window.innerWidth < 1280) setVisibleCards(3);
//       else setVisibleCards(4);
//     };
//     updateVisibleCards();
//     window.addEventListener('resize', updateVisibleCards);
//     return () => window.removeEventListener('resize', updateVisibleCards);
//   }, []);

//   const nextSlide = () => {
//     const maxSlides = Math.max(0, products.length - visibleCards);
//     setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1));
//   };

//   const prevSlide = () => {
//     const maxSlides = Math.max(0, products.length - visibleCards);
//     setCurrentSlide((prev) => (prev <= 0 ? maxSlides : prev - 1));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-6">
//         {/* Health Categories */}
//         <section className="mb-8">
//           <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Shop By Health Concerns</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
//             {healthCategories.map((category) => (
//               <button
//                 key={category.id}
//                 className="bg-white p-2 sm:p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border hover:border-teal-200 group"
//               >
//                 <div className="text-xl sm:text-2xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
//                   {category.icon}
//                 </div>
//                 <h3 className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
//                   {category.name}
//                 </h3>
//               </button>
//             ))}
//           </div>
//         </section>

//         {/* Super Saver Products */}
//         <section>
//           <div className="flex items-center justify-between mb-4 sm:mb-6">
//             <div>
//               <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Super Saver</h2>
//               <p className="text-sm sm:text-base text-gray-600">Up to 50% off</p>
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={prevSlide}
//                 className="p-1.5 sm:p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
//               >
//                 <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//               <button
//                 onClick={nextSlide}
//                 className="p-1.5 sm:p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
//               >
//                 <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//             </div>
//           </div>

//           <div className="relative overflow-hidden">
//             <div
//               className="flex transition-transform duration-300 ease-in-out"
//               style={{ transform: `translateX(-${(currentSlide * 100) / visibleCards}%)` }}
//             >
//               {products.map((product) => (
//                 <div
//                   key={product.id}
//                   className="flex-shrink-0 px-1 sm:px-2"
//                   style={{ width: `${100 / visibleCards}%` }}
//                 >
//                   <ProductCard
//                     product={product}
//                     isFavorite={favorites.has(product.id)}
//                     onToggleFavorite={toggleFavorite}
//                     onAddToCart={handleAddToCart}
//                     isAdding={addingProductId === product.id}
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default ShopUHealthComponent;


import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/ProductCard';
import HealthCategoryGrid from '../components/HealthCategoryGrid';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
}

interface HealthCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const ShopUHealthComponent: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [visibleCards, setVisibleCards] = useState(1);
  const { addToCart } = useCart();
  const [addingProductId, setAddingProductId] = useState<number | null>(null);

  const healthCategories: HealthCategory[] = [
    { id: 'diabetes', name: 'Diabetes Care', icon: '🩺' },
    { id: 'cardiac', name: 'Cardiac Care', icon: '❤️' },
    { id: 'elderly', name: 'Elderly Care', icon: '👴' },
    { id: 'oral', name: 'Oral Care', icon: '🦷' },
    { id: 'stomach', name: 'Stomach Care', icon: '🫁' },
    { id: 'pain', name: 'Pain Relief', icon: '💊' },
    { id: 'liver', name: 'Liver Care', icon: '🫀' },
  ];

  const products: Product[] = [
    {
      id: 1,
      name: 'Cofsils Gargle (Buy 1 Get 1 FREE)',
      price: 130,
      originalPrice: 260,
      discount: 50,
      rating: 4.5,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop',
      category: 'Oral Care',
    },
    {
      id: 2,
      name: 'She Need Hair Supplement with Folic Acid',
      price: 165,
      originalPrice: 275,
      discount: 40,
      rating: 4.3,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop',
      category: 'Hair Care',
    },
    {
      id: 3,
      name: 'Easylax L Oral Solution Lemon Sugar Free',
      price: 125,
      originalPrice: 165,
      discount: 24,
      rating: 4.2,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop',
      category: 'Digestive Health',
    },
    {
      id: 4,
      name: 'Combo Pack of Tata 1mg Pain Relief Spray',
      price: 51,
      originalPrice: 88,
      discount: 46,
      rating: 4.6,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop',
      category: 'Pain Relief',
    },
    {
      id: 5,
      name: 'Prega News Advance Pregnancy Rapid Test Kit',
      price: 194,
      originalPrice: 225,
      discount: 20,
      rating: 4.8,
      reviews: 312,
      image: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=300&h=300&fit=crop',
      category: "Women's Health",
    },
  ];

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (updated.has(productId)) {
        updated.delete(productId);
      } else {
        updated.add(productId);
      }
      return updated;
    });
  };

  const handleAddToCart = async (product: Product) => {
    setAddingProductId(product.id);
    try {
      await addToCart({ productId: product.id.toString(), quantity: 1 });
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Add to cart failed:', error);
    } finally {
      setAddingProductId(null);
    }
  };

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else if (window.innerWidth < 1280) setVisibleCards(3);
      else setVisibleCards(4);
    };
    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  const nextSlide = () => {
    const maxSlides = Math.max(0, products.length - visibleCards);
    setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxSlides = Math.max(0, products.length - visibleCards);
    setCurrentSlide((prev) => (prev <= 0 ? maxSlides : prev - 1));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ✅ Reusable Health Category Component */}
        <HealthCategoryGrid healthCategories={healthCategories} />

        {/* Super Saver Products */}
        <section>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Super Saver</h2>
              <p className="text-sm sm:text-base text-gray-600">Up to 50% off</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={prevSlide}
                className="p-1.5 sm:p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-1.5 sm:p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${(currentSlide * 100) / visibleCards}%)` }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 px-1 sm:px-2"
                  style={{ width: `${100 / visibleCards}%` }}
                >
                  <ProductCard
                    product={product}
                    isFavorite={favorites.has(product.id)}
                    onToggleFavorite={toggleFavorite}
                    onAddToCart={handleAddToCart}
                    isAdding={addingProductId === product.id}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShopUHealthComponent;
