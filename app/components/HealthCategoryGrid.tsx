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

const HealthCategoryGrid: React.FC<Props> = ({ title = "Shop By", title1 = " Health Condition", healthCategories }) => {
  return (
    <section className="py-6 max-w-7xl mx-auto ">
      <div className='w-60 mb-6'>
        <h2 className="text-xl sm:text-xl font-semibold text-primaryColor">{title} <span className="text-secondaryColor">{title1}</span> </h2>
        <hr className="bg-background1 h-1 border-0 rounded mt-1" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
        {healthCategories.map((category) => (
          <button
            key={category.id}
            className="bg-white p-2 sm:p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border hover:border-teal-200 group"
          >
            <div className="text-xl sm:text-2xl mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300">
              {category.icon}
            </div>
            <h3 className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-primaryColor transition-colors">
              {category.name}
            </h3>
          </button>
        ))}
      </div>
    </section>
  );
};

export default HealthCategoryGrid;
