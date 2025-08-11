'use client';

import { useEffect, useState } from "react";
import { X, MapPin, Search, Home, Briefcase, MoreHorizontal } from "lucide-react";


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

  const [selectedAddressType, setSelectedAddressType] = useState<"home" | "work" | "hotel" | "other">("home");
  const [searchLocation, setSearchLocation] = useState("");

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
            city: "Current City",
            state: "Current State"
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] shadow-2xl overflow-hidden flex">
        <div className="hidden md:flex flex-1 relative bg-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
            {/* Mock Map Interface */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="bg-white rounded-xl shadow-lg p-3 flex items-center gap-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your Location"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="flex-1 outline-none text-gray-700"
                />
              </div>
            </div>

            {/* Mock Map Content */}
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 mx-auto">
                  <MapPin className="w-16 h-16 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select Your Location</h3>
                <p className="text-gray-500 mb-4">Choose your delivery address on the map</p>
                
                <button
                  onClick={handleCurrentLocation}
                  className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors mx-auto"
                >
                  <MapPin className="w-4 h-4" />
                  Go to current location
                </button>
              </div>
            </div>

            {/* Mock Location Markers */}
            <div className="absolute top-1/3 left-1/3 w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
            <div className="absolute top-1/2 right-1/3 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 max-w-md bg-white flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {formMode === "edit" ? "Edit Address" : "Add Address"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter your details for seamless delivery experience
              </p>
            </div>
            <button
              onClick={onCancel}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              
              {/* Address Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Save address as
                </label>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setSelectedAddressType("home")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      selectedAddressType === "home"
                        ? "bg-teal-50 border-teal-500 text-teal-700"
                        : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSelectedAddressType("work")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      selectedAddressType === "work"
                        ? "bg-teal-50 border-teal-500 text-teal-700"
                        : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    Work
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setSelectedAddressType("other")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      selectedAddressType === "other"
                        ? "bg-teal-50 border-teal-500 text-teal-700"
                        : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <MoreHorizontal className="w-4 h-4" />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <input
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Floor (optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Area / Sector / Locality"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                <div>
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Nearby landmark (optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-teal-600 font-medium mb-4">
                  Enter your details for seamless delivery experiencej
                </p>
                
                <div className="space-y-4">
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    required
                  />

                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Your Phone Number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Hidden fields for complete address */}
              <div className="hidden">
                <input name="country" value={formData.country || "India"} onChange={handleChange} />
                <input name="postalCode" value={formData.postalCode || "000000"} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={handleSubmit}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
