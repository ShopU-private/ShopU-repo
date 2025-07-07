'use client';

import { useState } from 'react';

interface Props {
  title: string;
  options: string[];
  type: string;
  selected: string[];
  onChange: (type: string, value: string) => void;
}

const FilterSection = ({ title, options, type, selected, onChange }: Props) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="mb-3">
      <div
        className="flex cursor-pointer justify-between font-medium"
        onClick={() => setOpen(!open)}
      >
        {title}
        <span>{open ? '−' : '+'}</span>
      </div>
      {open && (
        <div className="mt-2 space-y-1">
          {options.map((opt, idx) => (
            <label key={idx} className="block text-sm">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onChange(type, opt)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
