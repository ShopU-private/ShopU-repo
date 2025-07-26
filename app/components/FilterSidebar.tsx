import { useState } from 'react';

const categories = [
  {
    name: 'Diapering',
    subcategories: ['Diaper', 'Wipes'],
  },
  {
    name: 'Diaper By Weight',
    subcategories: ['Diaper', 'Wipes'],
  },
  {
    name: 'Baby Food',
    subcategories: ['Diaper', 'Wipes'],
  },
  { name: 'Baby Skin Care' },
  { name: 'Baby Food By Age' },
  { name: 'Baby Hair Care' },
  { name: 'Baby Bath' },
];

const Sidebar = ({ onCategorySelect }: { onCategorySelect: (category: string) => void }) => {
  const [openCategory, setOpenCategory] = useState<string | null>('Diapering');

  const toggleCategory = (categoryName: string) => {
    setOpenCategory(prev => (prev === categoryName ? null : categoryName));
  };

  return (
    <aside className="h-full w-64 rounded bg-white p-4 shadow-sm">
      {/* Price Filter */}
      <div className="p-2">
        <div>
          <input type="range" min="0" max="1000" className="accent-primaryColor mb-4 w-full" />
        </div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex w-16 flex-col">
            <label className="mb-2 text-sm text-gray-600">Minimum</label>
            <input
              type="text"
              placeholder="₹250"
              className="rounded bg-gray-100 px-4 py-1 text-sm"
            />
          </div>
          <div className="flex w-16 flex-col">
            <label className="mb-2 text-sm text-gray-600">Maximum</label>
            <input
              type="text"
              placeholder="₹950"
              className="rounded bg-gray-100 px-4 py-1 text-sm"
            />
          </div>
          <button className="bg-background1 hover:bg-background1 mt-7 rounded px-2 py-1 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-2 text-xl font-semibold text-teal-700">Categories</h3>
        <hr className="mb-4 border text-gray-300" />
        <ul className="space-y-3">
          {categories.map(category => (
            <li key={category.name}>
              <div
                className="flex cursor-pointer items-center justify-between font-medium text-gray-800"
                onClick={() => toggleCategory(category.name)}
              >
                {category.name}
                <span className="text-2xl">{openCategory === category.name ? '-' : '+'}</span>
              </div>

              {/* Subcategories */}
              {openCategory === category.name && category.subcategories && (
                <ul className="mt-1 ml-4 space-y-1">
                  {category.subcategories.map((sub, idx) => (
                    <li
                      key={idx}
                      onClick={() => onCategorySelect(sub)}
                      className={`cursor-pointer text-sm ${
                        idx === 0 ? 'font-medium text-teal-600' : 'text-gray-600'
                      }`}
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
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
                'Teddyy Baby Diapers',
                'Little Angel Diaper',
                'LuvLap Diaper Pants',
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
        {['Maternity Care', 'Motherhood Stages', 'Age Group', 'Size Group'].map((section, idx) => (
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
