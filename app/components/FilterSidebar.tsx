'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

const filters: { [key: string]: string[] } = {
  Diapering: ['Diaper', 'Wipes'],
  ' Diaper By Weight': ['Dummy1', 'Dummy2', 'Dummy3', 'Dummy4'],
  'Baby Food': ['Dummy1', 'Dummy2', 'Dummy3', 'Dummy4'],
  'Baby Bath': ['Dummy1', 'Dummy2', 'Dummy3', 'Dummy4'],
  'Baby Skin Care': ['Dummy1', 'Dummy2', 'Dummy3', 'Dummy4'],
  'Baby Food By Age': ['Dummy1', 'Dummy2', 'Dummy3', 'Dummy4'],
  'Baby Hair Care': ['Dummy1', 'Dummy2', 'Dummy3', 'Dummy4'],
};

export default function FilterSidebar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleDropdown = (category: string) => {
    setOpenDropdown(openDropdown === category ? null : category);
  };

  const handleSelect = (item: string) => {
    if (!selectedFilters.includes(item)) {
      setSelectedFilters([...selectedFilters, item]);
    }
  };

  const removeFilters = (item: string) => {
    setSelectedFilters(selectedFilters.filter(filter => filter !== item));
  };

  return (
    <div className="w-64 bg-white p-4">
      {/* Selected Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {selectedFilters.map(item => (
          <span
            key={item}
            className="flex items-center rounded-full bg-blue-100 px-2 py-1 text-sm text-[#317c80]"
          >
            {item}
            <X className="ml-1 h-4 w-4 cursor-pointer" onClick={() => removeFilters(item)} />
          </span>
        ))}
      </div>

      {/* Category Filters */}
      <h2 className="mb-2 text-lg font-bold text-[#317C80]">Categories</h2>
      {Object.entries(filters).map(([category, items]) => (
        <div key={category} className="mb-3">
          <div
            onClick={() => toggleDropdown(category)}
            className="flex cursor-pointer items-center justify-between font-medium text-gray-800"
          >
            {category}
            {openDropdown === category ? <ChevronUp /> : <ChevronDown />}
          </div>
          {openDropdown === category && items.length > 0 && (
            <ul className="mt-2 ml-2 space-y-1">
              {items.map(item => (
                <li
                  key={item}
                  onClick={() => handleSelect(item)}
                  className={`cursor-pointer rounded-md px-2 py-1 text-sm ${
                    selectedFilters.includes(item) ? 'bg-[#317c80] text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );

  return (
    <div className="w-full md:w-64 bg-white p-4 overflow-y-auto">
      {renderSection('Categories', filters)}
      {renderSection('Filter By', filterBy)}

      <div className='mt-6'>
        {selectedFilters.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {selectedFilters.map((item) =>(
              <span key={item} className='bg-blue-100 text-[#317c80] px-2 py-1 rounded-full flex'>
                {item}
                <button className='ml-1'
                 onClick={() => setSelectedFilters((prev) => prev.filter((i) => i !== item))}>X</button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className='mt-6 text-right'>
        <button className='bg-[#317c80] text-white px-4 py-2 rounded'>Save</button>
      </div>
    </div>
  );
}
