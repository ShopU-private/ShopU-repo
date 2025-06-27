import React from 'react';

interface HealthCategory {
  id: string;
  name: string;
  icon: React.ReactNode; 
}

interface Props {
  title?: string;
  healthCategories: HealthCategory[];
}

const HealthCategoryGrid: React.FC<Props> = ({ title = "Shop By Health Concerns", healthCategories }) => {
  return (
    <section className="mb-8">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
        {healthCategories.map((category) => (
          <button
            key={category.id}
            className="bg-white p-2 sm:p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border hover:border-teal-200 group"
          >
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
              {category.name}
            </h3>
          </button>
        ))}
      </div>
    </section>
  );
};

export default HealthCategoryGrid;
