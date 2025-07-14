import React from 'react';

interface HealthCategory {
  id: string;
  name: string;
  image: string;
}

interface Props {
  healthCategories: HealthCategory[];
}

const HealthCategoryGrid: React.FC<Props> = ({ healthCategories }) => {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="w-60">
        <h2 className="text-primaryColor text-xl font-semibold sm:text-xl">
          Shop By <span className="text-secondaryColor">Health Condition</span>{' '}
        </h2>
        <hr className="bg-background1 mt-1 h-1 rounded border-0" />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-8 pb-10 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-7">
        {healthCategories.map(category => (
          <div key={category.id} className="group items-center rounded-lg">
            <div className="mb-1 flex justify-center transition-transform duration-300 group-hover:scale-102 sm:mb-2">
              <img src={category.image} alt="" className="h-34 w-36 rounded-lg" />
            </div>

            <h3 className="group-hover:text-primaryColor text-center text-sm font-medium text-black transition-colors sm:text-sm">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HealthCategoryGrid;
