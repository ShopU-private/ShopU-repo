'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, MapPin, Menu, X, Loader } from 'lucide-react';
import Image from 'next/image';
import Logo from '../../public/Shop U Logo-02.jpg';
import LoginModal from './LoginModal';
import Searchbar from './SearchBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [location, setLocation] = useState<{address: string; pincode: string} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  const checkLoginStatus = async () => {
    try {
      const res = await fetch('/api/account/is-logged-in');
      const data = await res.json();
      setIsLoggedIn(data.loggedIn);
    } catch {
      setIsLoggedIn(false);
    }
  };

  // Check login status when modal closes
  useEffect(() => {
    if (!isLoginModalOpen) {
      checkLoginStatus();
    }
  }, [isLoginModalOpen]);

  const categories = [
    'All Products',
    'Baby Care',
    'Nutritional Drinks & Supplements',
    'Women Care',
    'Personal Care',
    'Ayurveda',
    'Health Devices',
    'Home Essentials',
    'Health Condition',
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLocation = () => {
    setIsLocationOpen(!isLocationOpen);
    
    // If opening the location dropdown and no location yet, get user's location
    if (!isLocationOpen && !location && !isLoadingLocation) {
      getUserLocation();
    }
  };
  
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Use Nominatim OpenStreetMap API for reverse geocoding (free and no API key required)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch address');
          }
          
          const data = await response.json();
          
          // Extract location data
          const address = data.display_name.split(',').slice(0, 2).join(',');
          const pincode = data.address.postcode || 'Unknown';
          
          setLocation({ address, pincode });
        } catch (error) {
          setLocationError("Failed to get your location details");
          console.error(error);
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        console.error(error);
        setLocationError("Unable to retrieve your location");
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // Close the location dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    };

    if (isLocationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLocationOpen]);

  return (
    <nav className="bg-white shadow-lg">
      {/* Main Navbar */}
      <div className="border-b border-gray-200 px-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between space-x-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src={Logo}
              alt="ShopU - Shop Unlimited with ShopU"
              className="h-24 w-auto md:h-28"
              width={280}
              height={120}
            />
          </div>

          {/* Location Selector */}
          <div className="relative hidden items-center space-x-2 md:flex">
            <MapPin className="h-5 w-5 text-gray-600" />
            <div className="cursor-pointer" onClick={toggleLocation}>
              <p className="text-xs text-gray-500">Delivery Address</p>
              <p className="text-sm font-medium text-gray-800">
                {location ? location.address : "Select Address"} ▼
              </p>
            </div>
            {isLocationOpen && (
              <div
                ref={locationRef}
                className="absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border bg-white p-4 shadow-lg"
              >
                <h3 className="mb-2 font-semibold">Select Delivery Location</h3>
                <div className="space-y-2">
                  {isLoadingLocation ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader className="h-5 w-5 animate-spin text-teal-600 mr-2" />
                      <p>Getting your location...</p>
                    </div>
                  ) : locationError ? (
                    <div className="p-2 text-red-500">
                      <p>{locationError}</p>
                      <button 
                        onClick={getUserLocation}
                        className="mt-2 text-teal-600 text-sm hover:underline"
                      >
                        Try again
                      </button>
                    </div>
                  ) : location ? (
                    <div className="cursor-pointer rounded p-2 hover:bg-gray-100">
                      <p className="font-medium">{location.address}</p>
                      <p className="text-sm text-gray-600">{location.pincode}</p>
                    </div>
                  ) : (
                    <div className="cursor-pointer rounded p-2 hover:bg-gray-100" onClick={getUserLocation}>
                      <p className="font-medium">Use current location</p>
                      <p className="text-sm text-gray-600">Allow location access</p>
                    </div>
                  )}
                  
                  <div className="cursor-pointer rounded p-2 hover:bg-gray-100">
                    <p className="font-medium">Add New Address</p>
                    <p className="text-sm text-gray-600">Enter your pincode</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <Searchbar />

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button className="hidden items-center space-x-1 px-4 py-2 text-gray-700 transition-colors hover:text-teal-600 md:flex">
                <User className="h-5 w-5" />
                <span className="text-sm">Account</span>
              </button>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden items-center space-x-1 px-4 py-2 text-gray-700 transition-colors hover:text-teal-600 md:flex"
              >
                <User className="h-5 w-5" />
                <span className="text-sm">Login</span>
              </button>
            )}

            <button className="relative p-2 text-gray-700 transition-colors hover:text-teal-600">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-xs text-white">
                0
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="p-2 text-gray-700 transition-colors hover:text-teal-600 md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search essentials, groceries and more..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="hidden bg-gray-600 text-white md:block">
        <div className="mx-auto max-w-7xl px-4">
          <div className="no-scrollbar flex items-center space-x-8 overflow-x-auto py-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className="rounded px-2 py-1 text-sm whitespace-nowrap transition-colors hover:text-teal-300"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t bg-white md:hidden">
          <div className="space-y-2 px-4 py-2">
            {isLoggedIn ? (
              <button className="flex w-full items-center space-x-2 rounded p-2 text-left hover:bg-gray-100">
                <User className="h-5 w-5" />
                <span>Account</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center space-x-2 rounded p-2 text-left hover:bg-gray-100"
              >
                <User className="h-5 w-5" />
                <span>Login</span>
              </button>
            )}

            <div className="border-t pt-2">
              <p className="mb-2 text-sm font-medium text-gray-700">Categories</p>
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="block w-full rounded p-2 text-left text-sm text-gray-600 hover:bg-gray-100"
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="border-t pt-2">
              <button 
                className="flex w-full items-center space-x-2 rounded p-2 text-left hover:bg-gray-100"
                onClick={getUserLocation}
              >
                <MapPin className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">Delivery Address</p>
                  <p className="text-xs text-gray-600">
                    {isLoadingLocation ? "Getting location..." : location ? location.address : "Select your location"}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </nav>
  );
};

export default Header;
