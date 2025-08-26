'use client';

import { useEffect, useState } from 'react';
import { X, Search, Home, Briefcase, MoreHorizontal } from 'lucide-react';
import VectorMap from '../components/VectorMap';

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

type add = {
  long_name: string;
  short_name: string;
  types: string[];
};

type SearchResult = {
  place_id: string;
  description: string;
};


type Props = {
  onCancel: () => void;
  onSave: (address: Address) => void;
  formMode: 'add' | 'edit';
  initialData: Address | null;
};

type Prediction = {
  description: string;
  place_id: string;
};

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

export default function AddAddressForm({ onCancel, onSave, formMode, initialData }: Props) {
  const [formData, setFormData] = useState<Address>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    phoneNumber: '',
  });

  const [selectedAddressType, setSelectedAddressType] = useState<
    'home' | 'work' | 'hotel' | 'other'
  >('home');

  const [searchLocation, setSearchLocation] = useState('');
  const [results, setResults] = useState<Prediction[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formMode === 'edit' && initialData) {
      setFormData({ ...initialData });
      setSearchLocation(initialData.addressLine1 || '');
    }
  }, [formMode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  //  Search API
  const searchLocationAPI = async (query: string) => {
    if (query.length < 3) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/maps/autocomplete?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.predictions || []);
    } catch (err) {
      console.error('Autocomplete failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Select API
  const handleSelect = async (placeId: string, description: string) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/maps/details?place_id=${placeId}`);
      const data = await res.json();

      if (data?.result?.address_components) {
        let city = '',
          state = '',
          postalCode = '';

        (data.result.address_components as AddressComponent[]).forEach(c => {
          if (c.types.includes('locality')) city = c.long_name;
          if (c.types.includes('administrative_area_level_1')) state = c.long_name;
          if (c.types.includes('postal_code')) postalCode = c.long_name;
        });

        setFormData(prev => ({
          ...prev,
          city,
          state,
          postalCode,
          addressLine1: description,
        }));

        setSearchLocation(description);
        setResults([]);
      }
    } catch (err) {
      console.error('Details fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url =
        formMode === 'edit' && formData.id
          ? `/api/account/address/${formData.id}`
          : '/api/account/address';

      const method = formMode === 'edit' ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          addressType: selectedAddressType,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onSave(data.address || data);
        onCancel();
      } else {
        console.error('Failed to save:', await res.text());
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Left Map / Search Section */}
        <div className="relative hidden flex-1 bg-gray-100 md:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
            {/* Search Bar */}
            <div className="absolute top-4 right-4 left-4 z-20">
              <div className="relative rounded-xl bg-white p-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your Location"
                    value={searchLocation}
                    onChange={e => {
                      setSearchLocation(e.target.value);
                      searchLocationAPI(e.target.value);
                    }}
                    className="flex-1 text-gray-700 outline-none"
                  />

                  {loading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-teal-600 border-t-transparent"></div>
                  )}
                </div>

                {/* Suggestions */}
                {results.length > 0 && (
                  <div className="absolute top-full right-0 left-0 z-30 mt-2 max-h-60 overflow-y-auto rounded-xl border bg-white shadow-lg">
                    {results.map(r => (
                      <div
                        key={r.place_id}
                        onClick={() => handleSelect(r.place_id, r.description)}
                        className="cursor-pointer border-b p-3 last:border-none hover:bg-gray-50"
                      >
                        {r.description}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mock Map UI */}
            <div className="flex h-[500px] w-full items-center justify-center rounded-xl shadow">
              <VectorMap />
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <form onSubmit={handleSubmit} className="flex max-w-md flex-1 flex-col bg-white">
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
              type="button"
              onClick={onCancel}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {/* Address Type */}
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Save address as
              </label>

              <div className="flex flex-wrap gap-2">
                {['home', 'work', 'other'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedAddressType(type as 'home' | 'work' | 'other')}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-all ${
                      selectedAddressType === type
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {type === 'home' && <Home className="h-4 w-4" />}
                    {type === 'work' && <Briefcase className="h-4 w-4" />}
                    {type === 'other' && <MoreHorizontal className="h-4 w-4" />}
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Address Inputs */}
            <div className="space-y-4">
              <input
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                placeholder="Flat / House no / Building name"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                required
              />

              <input
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                placeholder="Floor (optional)"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />

              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                required
              />

              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />

              <input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Postal Code"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Personal Info */}

            <div className="border-t pt-4">
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Name"
                className="mb-4 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                required
              />

              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-6">
            <button
              type="submit"
              className="w-full rounded-xl bg-teal-600 py-4 font-medium text-white shadow-lg transition hover:bg-teal-700"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
