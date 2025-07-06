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

const HealthCategoryGrid: React.FC<Props> = ({
  title = 'Shop By Health Concerns',
  healthCategories,
}) => {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">{title}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-7">
        {healthCategories.map(category => (
          <button
            key={category.id}
            className="group rounded-lg border bg-white p-2 shadow-sm transition-all duration-300 hover:border-teal-200 hover:shadow-md sm:p-3"
          >
            <div className="mb-1 text-xl transition-transform duration-300 group-hover:scale-110 sm:mb-2 sm:text-2xl">
              {category.icon}
            </div>
            <h3 className="text-xs font-medium text-gray-900 transition-colors group-hover:text-teal-600 sm:text-sm">
              {category.name}
            </h3>
          </button>
        ))}
      </div>
    </section>
  );
};

export default HealthCategoryGrid;
