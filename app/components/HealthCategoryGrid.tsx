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
    <section className="mb-8 max-w-7xl mx-auto ">
      <div className='w-60 mb-6'>
        <h2 className="text-xl sm:text-xl font-semibold text-[#317C80]">{title} <span className="text-[#E93E40]">{title1}</span> </h2>
        <hr className="bg-[#317C80] h-1 border-0 rounded mt-1" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
        {healthCategories.map((category) => (
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
