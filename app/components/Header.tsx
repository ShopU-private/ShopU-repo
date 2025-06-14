'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, MapPin, Menu, X } from 'lucide-react';
import Image from 'next/image';
import Logo from '../../public/Shop U Logo-02.jpg';
import LoginModal from './LoginModal';
import Searchbar from './SearchBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
              <p className="text-sm font-medium text-gray-800">Select Address ▼</p>
            </div>
            {isLocationOpen && (
              <div
                ref={locationRef}
                className="absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border bg-white p-4 shadow-lg"
              >
                <h3 className="mb-2 font-semibold">Select Delivery Location</h3>
                <div className="space-y-2">
                  <div className="cursor-pointer rounded p-2 hover:bg-gray-100">
                    <p className="font-medium">Kottagūdem, Telangana</p>
                    <p className="text-sm text-gray-600">507101</p>
                  </div>
                  <div className="cursor-pointer rounded p-2 hover:bg-gray-100">
                    <p className="font-medium">Add New Address</p>
                    <p className="text-sm text-gray-600">Enter your pincode</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          {/* <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search essentials, groceries and more..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div> */}

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

      <div className="bg-gray-600 text-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 py-3 overflow-x-auto no-scrollbar">

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
              <button className="flex w-full items-center space-x-2 rounded p-2 text-left hover:bg-gray-100">
                <MapPin className="h-5 w-5" />
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
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </nav>
  );
};

export default Header;
