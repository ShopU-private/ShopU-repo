'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface SubCategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

const Sidebar = ({ onCategorySelect }: { onCategorySelect: (subCategoryId: string) => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/products/category');
        const data: Category[] = await res.json();

        if (categorySlug) {
          const matchedCategory = data.find(cat => cat.name === categorySlug);
          if (matchedCategory) {
            setCategories([matchedCategory]);
            setOpenCategory(matchedCategory.id);
          } else {
            setCategories([]);
          }
        } else {
          setCategories(data);
        }
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };

    fetchCategories();
  }, [categorySlug]);

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(prev => (prev === categoryId ? null : categoryId));
  };

  return (
    <aside className="h-full w-64 rounded bg-white p-4 shadow-sm">
      <input type="range" min="0" max="1000" className="accent-primaryColor my-4 w-full" />
      <h3 className="mb-2 text-xl font-semibold text-teal-700">Categories</h3>
      <hr className="mb-4 border text-gray-300" />
      <ul className="space-y-3">
        {categories.map(category => (
          <li key={category.id}>
            <div
              className="text-md flex cursor-pointer items-center justify-between px-4 font-medium text-gray-800"
              onClick={() => toggleCategory(category.id)}
            >
              {category.name}
              <span className="text-2xl">{openCategory === category.id ? '-' : '+'}</span>
            </div>

            {openCategory === category.id && category.subCategories.length > 0 && (
              <ul className="mt-1 ml-4 space-y-1 px-3">
                {category.subCategories.map(sub => (
                  <li
                    key={sub.id}
                    onClick={() => onCategorySelect(sub.name)}
                    className="cursor-pointer text-sm text-gray-600 hover:text-teal-600"
                  >
                    {sub.name}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {/* Brand Filter */}
      <div className="mt-6">
        <h3 className="mb-2 text-xl font-semibold text-teal-700">Filter By</h3>
        <hr className="mb-4 border text-gray-300" />

        {/* Brand Section */}
        <div>
          <div
            className="flex cursor-pointer items-center justify-between font-medium text-gray-800"
            onClick={() => toggleCategory('Brand')}
          >
            Brand
            <span className="text-2xl">{openCategory === 'Brand' ? '-' : '+'}</span>
          </div>

          {openCategory === 'Brand' && (
            <ul className="mt-2 ml-2 space-y-2">
              {[
                'Mamy Poko Pants Diaper',
                'Pampers Baby Diaper',
                'Huggies Dry Diapers',
                'Friends Adult Diapers',
              ].map((brand, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <input type="checkbox" id={`brand-${idx}`} className="accent-teal-600" />
                  <label htmlFor={`brand-${idx}`} className="cursor-pointer text-sm text-gray-700">
                    {brand}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Placeholder for other filter sections */}
        {['Maternity Care', 'Motherhood Stages', 'Age Group'].map((section, idx) => (
          <div
            key={idx}
            className="mt-4 flex cursor-pointer items-center justify-between font-medium text-gray-800"
            onClick={() => toggleCategory(section)}
          >
            {section}
            <span className="text-2xl">{openCategory === section ? '-' : '+'}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
