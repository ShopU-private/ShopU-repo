import React from 'react';

interface HealthCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface Props {
  title?: string;
  title1?: string;
  healthCategories: HealthCategory[];
}

const HealthCategoryGrid: React.FC<Props> = ({
  title = 'Shop By',
  title1 = ' Health Condition',
  healthCategories,
}) => {
  return (
    <section className="mx-auto max-w-7xl py-6">
      <div className="mb-6 w-60">
        <h2 className="text-primaryColor text-xl font-semibold sm:text-xl">
          {title} <span className="text-secondaryColor">{title1}</span>{' '}
        </h2>
        <hr className="bg-background1 mt-1 h-1 rounded border-0" />
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-7">
        {healthCategories.map(category => (
          <button
            key={category.id}
            className="group rounded-lg border bg-white p-2 shadow-sm transition-all duration-300 hover:border-teal-200 hover:shadow-md sm:p-3"
          >
            <div className="mb-1 text-xl transition-transform duration-300 group-hover:scale-110 sm:mb-2 sm:text-2xl">
              {category.icon}
            </div>
            <h3 className="group-hover:text-primaryColor text-xs font-medium text-gray-900 transition-colors sm:text-sm">
              {category.name}
            </h3>
          </button>
        ))}
      </div>
    </section>
  );
};

export default HealthCategoryGrid;
