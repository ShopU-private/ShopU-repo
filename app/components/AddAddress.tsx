'use client';

import { useEffect, useState } from 'react';

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
        onSave(data.address || data); // handle both POST and PATCH response
        onCancel();
      } else {
        console.error('Failed to save address:', await res.text());
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[90%] rounded-2xl bg-white p-8 shadow-xl md:w-[700px]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {formMode === 'edit' ? 'Edit Address' : 'Add Address'}
          </h2>
          <button
            onClick={onCancel}
            className="text-2xl font-light text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              required
            />
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              required
            />
          </div>

          <input
            name="addressLine1"
            value={formData.addressLine1}
            onChange={handleChange}
            placeholder="Address Line 1"
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
            required
          />

          <input
            name="addressLine2"
            value={formData.addressLine2}
            onChange={handleChange}
            placeholder="Address Line 2 (optional)"
            className="w-full rounded-lg border border-gray-300 px-4 py-3"
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              required
            />
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              required
            />
            <input
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              required
            />
            <input
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
              className="w-full rounded-lg border border-gray-300 px-4 py-3"
              required
            />
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg bg-gray-100 px-6 py-3 text-gray-700"
            >
              Cancel
            </button>
            <button type="submit" className="rounded-lg bg-blue-600 px-6 py-3 text-white">
              {formMode === 'edit' ? 'Update Address' : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
