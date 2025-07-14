// components/FilterSidebar.tsx 'use client';

import { useState } from 'react'; import { ChevronDown, ChevronUp } from 'lucide-react';

type Props = { selectedFilters: string[]; setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>; };

const filters = { Diapering: ['Dummy1', 'Dummy2', 'Dummy3', 'Dummy4'], 'Baby Bath': ['Dummy1', 'Dummy2', 'Dummy3', 'Dummy4'], 'Baby Food': ['Dummy1', 'Dummy2', 'Dummy3', 'Dummy4'], Wipes: ['Dummy1', 'Dummy2', 'Dummy3', 'Dummy4'], 'Baby Hair Care': ['Dummy1', 'Dummy2', 'Dummy3', 'Dummy4'], 'Baby Skin Care': ['Dummy1', 'Dummy2', 'Dummy3', 'Dummy4'], 'Baby Food By Age': ['Dummy1', 'Dummy2', 'Dummy3', 'Dummy4'], };

const filterBy = { Brand: ['Filters1', 'Filters2', 'Filters3', 'Filters4'], Benefits: ['Filters1', 'Filters2', 'Filters3', 'Filters4'], 'Skin Type': ['Filters1', 'Filters2', 'Filters3', 'Filters4'], 'Age Group': ['Filters1', 'Filters2', 'Filters3', 'Filters4'], 'Health Condition': ['Filters1', 'Filters2', 'Filters3', 'Filters4'], Flavor: ['Filters1', 'Filters2', 'Filters3', 'Filters4'], 'Allergen Information': ['Filters1', 'Filters2', 'Filters3', 'Filters4'], };

export default function FilterSidebar({ selectedFilters, setSelectedFilters }: Props) { const [openDropdown, setOpenDropdown] = useState<string | null>(null);

const toggleDropdown = (category: string) => { setOpenDropdown(openDropdown === category ? null : category); };

const handleSelect = (item: string) => { if (!selectedFilters.includes(item)) { setSelectedFilters([...selectedFilters, item]); } };

const renderSection = (sectionTitle: string, data: { [key: string]: string[] }) => { 
  return (
    <> 
      <h2 className="mt-6 mb-2 text-lg font-bold text-[#317c80]">{sectionTitle}</h2> 
      {Object.entries(data).map(([category, items]) => (
        <div key={category} className="mb-3"> 
          <div onClick={() => toggleDropdown(category)}
            className="flex cursor-pointer items-center justify-between font-medium text-gray-800" > 
            {category} {openDropdown === category ? <ChevronUp /> : <ChevronDown />} 
          </div> 
          {openDropdown === category && ( 
            <ul className="mt-2 ml-2 space-y-1"> {items.map((item: string) => (
              <li key={item} onClick={() => handleSelect(item)}
                className={`cursor-pointer rounded-md px-2 py-1 text-sm ${selectedFilters.includes(item) ? 'bg-[#317c80] text-white' : 'hover:bg-gray-100'}`} > 
                {item} 
              </li> 
            ))} 
            </ul> 
          )} 
        </div> 
      ))} 
    </> 
  );
};

return ( <div className="w-full md:w-64 bg-white p-4 overflow-y-auto max-h-[90vh]"> {renderSection('Categories', filters)} {renderSection('Filter By', filterBy)}

{/* Show selected filters below on mobile */}
  <div className="mt-6">
    {selectedFilters.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {selectedFilters.map((item) => (
          <span
            key={item}
            className="bg-blue-100 text-[#317c80] px-2 py-1 rounded-full flex items-center text-sm"
          >
            {item}
            <button
              className="ml-1"
              onClick={() =>
                setSelectedFilters((prev) => prev.filter((i) => i !== item))
              }
            >
              ×
            </button>
          </span>
        ))}
      </div>
    )}
  </div>

  {/* Save button (bottom right) */}
  <div className="mt-6 text-right">
    <button className="bg-[#317c80] text-white px-4 py-2 rounded">Save</button>
  </div>
</div>

); }