'use client';

import { useEffect, useState } from 'react';
import { X, MapPin, Search, Home, Briefcase, MoreHorizontal } from 'lucide-react';

type Address = {
  id?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
};

type Props = {
  onCancel: () => void;
  onSave: (address: Address) => void;
  formMode: 'add' | 'edit';
  initialData: Address | null;
};

export default function AddAddressForm({ onCancel, onSave, formMode, initialData }: Props) {
  const [formData, setFormData] = useState<Address>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phoneNumber: '',
  });

  const [selectedAddressType, setSelectedAddressType] = useState<
    'home' | 'work' | 'hotel' | 'other'
  >('home');
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    if (formMode === 'edit' && initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        addressLine1: initialData.addressLine1 || '',
        addressLine2: initialData.addressLine2 || '',
        city: initialData.city || '',
        state: initialData.state || '',
        country: initialData.country || '',
        postalCode: initialData.postalCode || '',
        phoneNumber: initialData.phoneNumber || '',
        id: initialData.id,
      });
    }
  }, [formMode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let res;

      if (formMode === 'edit' && formData.id) {
        res = await fetch(`/api/account/address/${formData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch('/api/account/address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        const data = await res.json();
        onSave(data.address || data);
        onCancel();
      } else {
        console.error('Failed to save address:', await res.text());
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Mock reverse geocoding - in real app, use Google Maps API
          setFormData(prev => ({
            ...prev,
            city: 'Current City',
            state: 'Current State',
          }));
        },
        error => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="relative hidden flex-1 bg-gray-100 md:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
            {/* Mock Map Interface */}
            <div className="absolute top-4 right-4 left-4 z-10">
              <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-lg">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your Location"
                  value={searchLocation}
                  onChange={e => setSearchLocation(e.target.value)}
                  className="flex-1 text-gray-700 outline-none"
                />
              </div>
            </div>

            {/* Mock Map Content */}
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lg">
                  <MapPin className="h-16 w-16 text-teal-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-700">Select Your Location</h3>
                <p className="mb-4 text-gray-500">Choose your delivery address on the map</p>

                <button
                  onClick={handleCurrentLocation}
                  className="mx-auto flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700"
                >
                  <MapPin className="h-4 w-4" />
                  Go to current location
                </button>
              </div>
            </div>

            {/* Mock Location Markers */}
            <div className="absolute top-1/3 left-1/3 h-8 w-8 animate-pulse rounded-full border-4 border-white bg-red-500 shadow-lg"></div>
            <div className="absolute top-1/2 right-1/3 h-6 w-6 rounded-full border-2 border-white bg-blue-500 shadow-lg"></div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex max-w-md flex-1 flex-col bg-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {formMode === 'edit' ? 'Edit Address' : 'Add Address'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Enter your details for seamless delivery experience
              </p>
            </div>
            <button
              onClick={onCancel}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Address Type Selection */}
              <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">
                  Save address as
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAddressType('home')}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-all ${
                      selectedAddressType === 'home'
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAddressType('work')}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-all ${
                      selectedAddressType === 'work'
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <Briefcase className="h-4 w-4" />
                    Work
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAddressType('other')}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-all ${
                      selectedAddressType === 'other'
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    Other
                  </button>
                </div>
              </div>

              {/* Address Fields */}
              <div className="space-y-4">
                <div>
                  <input
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="Flat / House no / Building name"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <input
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Floor (optional)"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Area / Sector / Locality"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Nearby landmark (optional)"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="border-t border-gray-100 pt-4">
                <p className="mb-4 text-sm font-medium text-teal-600">
                  Enter your details for seamless delivery experiencej
                </p>

                <div className="space-y-4">
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    required
                  />

                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Your Phone Number"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all outline-none focus:border-transparent focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>

              {/* Hidden fields for complete address */}
              <div className="hidden">
                <input name="country" value={formData.country || 'India'} onChange={handleChange} />
                <input
                  name="postalCode"
                  value={formData.postalCode || '000000'}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 p-6">
            <button
              onClick={handleSubmit}
              className="w-full transform rounded-xl bg-teal-600 py-4 font-medium text-white shadow-lg transition-colors duration-200 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-xl"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
