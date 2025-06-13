"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, MapPin, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Logo from "../../public/Shop U Logo-02.jpg";
import LoginModal from './LoginModal';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  const checkLoginStatus = async() => {
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
  };

  // Close the location dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    };

    if (isLocationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLocationOpen]);

  return (
    <nav className="bg-white shadow-lg">
      {/* Main Navbar */}
      <div className="px-2 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between space-x-4">
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
          <div className="hidden md:flex items-center space-x-2 relative">
            <MapPin className="w-5 h-5 text-gray-600" />
            <div className="cursor-pointer" onClick={toggleLocation}>
              <p className="text-xs text-gray-500">Delivery Address</p>
              <p className="text-sm font-medium text-gray-800">
                Select Address ▼
              </p>
            </div>
            {isLocationOpen && (
              <div
                ref={locationRef}
                className="absolute top-full mt-2 left-0 bg-white border rounded-lg shadow-lg p-4 w-64 z-50"
              >
                <h3 className="font-semibold mb-2">Select Delivery Location</h3>
                <div className="space-y-2">
                  <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                    <p className="font-medium">Kottagūdem, Telangana</p>
                    <p className="text-sm text-gray-600">507101</p>
                  </div>
                  <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                    <p className="font-medium">Add New Address</p>
                    <p className="text-sm text-gray-600">Enter your pincode</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search essentials, groceries and more..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button 
                className="hidden md:flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-teal-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">Account</span>
              </button>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden md:flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-teal-600 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">Login</span>
              </button>
            )}

            <button className="relative p-2 text-gray-700 hover:text-teal-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-teal-600 transition-colors"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search essentials, groceries and more..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-gray-600 text-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 py-3 overflow-x-auto">
            {categories.map((category, index) => (
              <button
                key={index}
                className="whitespace-nowrap text-sm hover:text-teal-300 transition-colors py-1 px-2 rounded"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-2">
            {isLoggedIn ? (
              <button 
                className="flex items-center space-x-2 w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                <User className="w-5 h-5" />
                <span>Account</span>
              </button>
            ) : (
              <button 
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full text-left p-2 hover:bg-gray-100 rounded"
              >
                <User className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}

            <div className="border-t pt-2">
              <p className="text-sm font-medium text-gray-700 mb-2">Categories</p>
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="block w-full text-left text-sm p-2 hover:bg-gray-100 rounded text-gray-600"
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="border-t pt-2">
              <button className="flex items-center space-x-2 w-full text-left p-2 hover:bg-gray-100 rounded">
                <MapPin className="w-5 h-5" />
                <div>
                  <p className="text-sm font-medium">Delivery Address</p>
                  <p className="text-xs text-gray-600">Select your location</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </nav>
  );
};

export default Header;
