"use client";

import { useEffect, useState } from "react";
import { X, MapPin, Search, Home, Briefcase, Building, MoreHorizontal } from "lucide-react";

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
  formMode: "add" | "edit";
  initialData: Address | null;
};

export default function AddAddressForm({
  onCancel,
  onSave,
  formMode,
  initialData,
}: Props) {
  const [formData, setFormData] = useState<Address>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phoneNumber: "",
  });


  const [selectedAddressType, setSelectedAddressType] = useState<"home" | "work" | "hotel" | "other">("home");
  const [searchLocation, setSearchLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const apikey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (formMode === "edit" && initialData) {
      setFormData({
        fullName: initialData.fullName || "",
        addressLine1: initialData.addressLine1 || "",
        addressLine2: initialData.addressLine2 || "",
        city: initialData.city || "",
        state: initialData.state || "",
        country: initialData.country || "",
        postalCode: initialData.postalCode || "",
        phoneNumber: initialData.phoneNumber || "",
        id: initialData.id,
      });
    }
  }, [formMode, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validation check
    if (!formData.fullName || !formData.phoneNumber || !formData.addressLine1 || !formData.city) {
      alert("Please fill all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        addressType: selectedAddressType, // Include address type
        country: formData.country || "India",
        postalCode: formData.postalCode || "000000",
        state: formData.state || formData.city,
      };

      let res;
      if (formMode === "edit" && formData.id) {
        res = await fetch(`/api/account/address/${formData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(submitData),
        });
      } else {
        res = await fetch("/api/account/address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(submitData),
        });
      }

      if (res.ok) {
        const data = await res.json();
        onSave(data.address || data);
        onCancel();
      } else {
        const errorText = await res.text();
        console.error("Failed to save address:", errorText);
        alert("Failed to save address. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const searchLocationAPI = async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&components=country:in&key=${apikey}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.predictions) {
          setSearchResults(data.predictions);
          setShowSearchResults(true);
        }
      } else {
        console.error("Google Places API error:", response.status);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSelect = async (result: any) => {
    try {
      setIsLoading(true);

      // Get place details using place_id
      const detailsResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${result.place_id}&fields=address_components,geometry,formatted_address&key=${apikey}`
      );

      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        const addressComponents = detailsData.result.address_components;

        // Parse address components
        let city = "";
        let state = "";
        let country = "India";
        let postalCode = "";
        let route = "";
        let streetNumber = "";

        addressComponents.forEach((component: any) => {
          const types = component.types;

          if (types.includes("locality") || types.includes("sublocality")) {
            city = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
          } else if (types.includes("country")) {
            country = component.long_name;
          } else if (types.includes("postal_code")) {
            postalCode = component.long_name;
          } else if (types.includes("route")) {
            route = component.long_name;
          } else if (types.includes("street_number")) {
            streetNumber = component.long_name;
          }
        });

        setFormData(prev => ({
          ...prev,
          city: city,
          state: state,
          country: country,
          postalCode: postalCode,
          addressLine1: `${streetNumber} ${route}`.trim() || result.description.split(',')[0],
          addressLine2: ""
        }));

        setSearchLocation(result.description);
        setShowSearchResults(false);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error getting place details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Using OpenStreetMap Nominatim API (free alternative to Google Maps)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
            );

            if (response.ok) {
              const data = await response.json();
              const address = data.address;

              setFormData(prev => ({
                ...prev,
                city: address.city || address.town || address.village || address.suburb || "",
                state: address.state || address.region || "",
                country: address.country || "India",
                postalCode: address.postcode || "",
                addressLine1: `${address.house_number || ""} ${address.road || ""}`.trim() ||
                  `Near ${address.amenity || address.shop || "Current Location"}`,
                addressLine2: address.neighbourhood || address.suburb || ""
              }));

              console.log("Location detected:", data);
            } else {
              // Fallback if API fails
              setFormData(prev => ({
                ...prev,
                city: "Location Detected",
                state: "Please update manually",
                addressLine1: `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
              }));
            }
          } catch (error) {
            console.error("Reverse geocoding failed:", error);
            // Fallback with coordinates
            setFormData(prev => ({
              ...prev,
              city: "Location Found",
              state: "Update manually",
              addressLine1: `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            }));
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          setIsLoading(false);
          console.error("Error getting location:", error);
          let errorMessage = "Could not get your location. ";

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please allow location access.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += "Unknown error occurred.";
              break;
          }

          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] shadow-2xl overflow-hidden flex">

        {/* Map Section - Hidden on mobile */}
        <div className="hidden md:flex flex-1 relative bg-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
            {/* Mock Map Interface */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="bg-white rounded-xl shadow-lg p-3 relative">
                <div className="flex items-center gap-3">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search your Location"
                    value={searchLocation}
                    onChange={(e) => {
                      setSearchLocation(e.target.value);
                      searchLocationAPI(e.target.value);
                    }}
                    className="flex-1 outline-none text-gray-700"
                  />
                  {isLoading && <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>}
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-20">
                    {searchResults.map((result, index) => (
                      <div
                        key={result.place_id || index}
                        onClick={() => handleSearchSelect(result)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-sm text-gray-800">
                              {result.structured_formatting?.main_text || result.description.split(',')[0]}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {result.structured_formatting?.secondary_text || result.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {showSearchResults && searchResults.length === 0 && searchLocation.length >= 3 && !isLoading && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-20">
                    <div className="text-sm text-gray-500 text-center">
                      No locations found for "{searchLocation}"
                    </div>
                  </div>
                )}
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
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MapPin className="w-4 h-4" />
                  {isLoading ? "Getting Location..." : "Go to current location"}
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${selectedAddressType === "home"
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
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${selectedAddressType === "work"
                        ? "bg-teal-50 border-teal-500 text-teal-700"
                        : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    Work
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAddressType("hotel")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${selectedAddressType === "hotel"
                        ? "bg-teal-50 border-teal-500 text-teal-700"
                        : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}
                  >
                    <Building className="w-4 h-4" />
                    Hotel
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedAddressType("other")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${selectedAddressType === "other"
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
                  Enter your details for seamless delivery experience
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

              {/* Additional fields that might be needed */}
              <div className="space-y-4">
                <input
                  name="country"
                  value={formData.country || "India"}
                  onChange={handleChange}
                  placeholder="Country"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
                <input
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-4 rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Saving..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};