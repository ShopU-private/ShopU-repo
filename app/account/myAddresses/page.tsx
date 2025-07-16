import Navroute from '@/app/components/navroute';
import { Trash2, Home, Plus } from 'lucide-react';

const Addresses = () => {
  const addresses = [
    {
      id: 1,
      name: 'Saravana Kumar',
      address: 'I46, Manickam Palayam, Posari thottam, Erode',
    },
  ];

  return (
    <>
      <Navroute />
      <div className="min-h-screen bg-[#f5f5f5] px-20 py-6">
        <div className="mx-auto max-w-7xl bg-transparent">
          {/* Header */}
          <h2 className="text-primaryColor mb-6 text-lg font-semibold sm:text-xl">
            My <span className="text-secondaryColor">Addresses</span>
            <hr className="bg-background1 mt-1 w-36 rounded border-2" />{' '}
          </h2>

          {/* Add New Address */}
          <button className="mb-4 flex items-center gap-2 text-sm font-medium text-green-600">
            <Plus className="h-4 w-4" />
            Add new address
          </button>

          {/* Address Card */}
          <div className="flex items-center justify-between rounded bg-white px-6 py-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Home className="text-teal-600" />
              <span className="text-sm text-gray-800">
                {addresses[0].name}, {addresses[0].address}
              </span>
            </div>
            <button className="text-gray-500 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Addresses;
