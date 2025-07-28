'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  ShoppingCart,
  User,
  MapPin,
  Menu,
  X,
  Loader,
  ChevronDown,
  Shield,
} from 'lucide-react';
import Image from 'next/image';
import Logo from '../../public/Shop U Logo-03.jpg';
import LoginModal from './LoginModal';
import Searchbar from './SearchBar';

import { useLocation } from '../context/LocationContext';
import { useCartModal } from '../context/CartModalContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(null);
  const router = useRouter();
  const {
    location,
    setLocation,
    isLoadingLocation,
    setIsLoadingLocation,
    locationError,
    setLocationError = () => {}, // Provide default empty function
  } = useLocation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const { openCartModal } = useCartModal();
  const [cartCount, setCartCount] = useState(0);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [pincode, setPincode] = useState('');
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const [showPincodeInput, setShowPincodeInput] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [isMobileAccountMenuOpen, setIsMobileAccountMenuOpen] = useState(false);

  const mobileAccountMenuRef = useRef<HTMLDivElement>(null);
  const fetchCartCount = React.useCallback(async () => {
    try {
      setIsLoadingCart(true);
      const response = await fetch('/api/cart/count');

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCartCount(data.count.items);
        }
      } else if (response.status !== 401) {
        // Don't show error for unauthorized (not logged in)
        console.error('Failed to fetch cart count');
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    } finally {
      setIsLoadingCart(false);
    }
  }, []);

  // Check login status and fetch cart count
  const checkLoginStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/account/me');
      const data = await res.json();
      setIsLoggedIn(data.loggedIn);
      setPhoneNumber(data.phoneNumber);
      setIsAdmin(data.role?.toUpperCase() === 'ADMIN');
      if (data.loggedIn) {
        fetchCartCount();
      } else {
        setCartCount(0);
      }
    } catch {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setCartCount(0);
    }
  }, [fetchCartCount]);

  // Check login status when modal closes
  useEffect(() => {
    if (!isLoginModalOpen) {
      checkLoginStatus();
    }
  }, [isLoginModalOpen, checkLoginStatus]);

  useEffect(() => {
    const handleUpdate = () => {
      const timeout = setTimeout(() => {
        fetchCartCount();
      }, 200); // slight debounce

      return () => clearTimeout(timeout);
    };

    window.addEventListener('cartCountUpdated', handleUpdate);
    return () => window.removeEventListener('cartCountUpdated', handleUpdate);
  }, [fetchCartCount]);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      if (isLoggedIn) {
        fetchCartCount();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [isLoggedIn, fetchCartCount]);

  // Initial load
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const handleClick = () => {
    router.push('/');
  };
  const categories = [
    {
      name: 'Baby Care',
      subcategories: [
        'Diapering',
        'Diaper By Weight',
        'Baby Food',
        'Baby Skin Care',
        'Baby Food By Age',
        'Baby Hair Care',
        'Baby Bath',
      ],
    },
    {
      name: 'Nutritional Drinks',
      subcategories: [
        'Nutritional Drinks',
        'Sports Nutrition',
        'Vitamins & Supplements',
        'Minerals',
        'Omega & Fish Oil',
      ],
    },
    {
      name: 'Women Care',
      subcategories: [
        'Feminine Hygiene',
        'Gyno Care',
        'Women Supplements',
        'Pregnancy',
        'Grooming',
      ],
    },
    {
      name: 'Personal Care',
      subcategories: [
        'Skin Care',
        'Hair Care',
        'Oral Care',
        'Mens Grooming',
        'Sexual Wellness',
        'Fragrances',
      ],
    },
    {
      name: 'Ayurveda',
      subcategories: ['Health Concers', 'Herbs', 'Herbal Juices', 'Chyawanprash', 'Honey'],
    },
    {
      name: 'Health Devices',
      subcategories: [
        'Bp Monitors',
        'Covid Test Kits',
        'Glucometers & Test Strips',
        'Thermometers',
        'Plus Oximeters',
        'Pregnancy test Kit',
        'Heating Belts',
        'Weighing machine',
        'Nebulizer',
        'Supports & Splints',
        'Health Accessories',
      ],
    },
    {
      name: 'Home Essentials',
      subcategories: [
        'Insect Repellents',
        'Antiseptic Liquids',
        'Room Freshners',
        'Cleaning Essentials',
        'Batteries',
        'Pet Food',
      ],
    },
    {
      name: 'Health Condition',
      subcategories: [
        'Mental Wellness',
        'Liver Care',
        'Diabetic',
        'Pain Relief',
        'Cardiac',
        'Kidney Care',
        'Stomach Care',
        'Eye Care',
        'Cold & Cough',
        'Wound Care',
        'Sleep Aids',
        'Bone, Joint & Muscle',
      ],
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLocation = () => {
    setIsLocationOpen(!isLocationOpen);

    if (!isLocationOpen && !location && !isLoadingLocation) {
      getUserLocation();
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const getUserLocation = () => {
    if (setIsLoadingLocation) setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      if (setIsLoadingLocation) setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async position => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch address');
          }

          const data = await response.json();

          const address = data.display_name.split(',').slice(0, 2).join(', ');
          const pincode = data.address.postcode || 'Unknown';

          setLocation({ address, pincode });
          setShowPincodeInput(false);
        } catch (error) {
          setLocationError('Failed to get your location details');
          console.error(error);
        } finally {
          if (setIsLoadingLocation) setIsLoadingLocation(false);
        }
      },
      error => {
        console.error(error);
        setLocationError('Unable to retrieve your location');
        if (setIsLoadingLocation) setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const fetchLocationByPincode = async (inputPincode: string) => {
    if (!inputPincode || inputPincode.length < 6) {
      setLocationError('Please enter a valid 6-digit pincode');
      return;
    }

    setIsLoadingPincode(true);
    setLocationError(null);

    try {
      // Using India Post API for pincode lookup
      const response = await fetch(`https://api.postalpincode.in/pincode/${inputPincode}`);

      if (!response.ok) {
        throw new Error('Failed to fetch location');
      }

      const data = await response.json();

      if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const address = `${postOffice.Name}, ${postOffice.District}, ${postOffice.State}`;

        setLocation({
          address,
          pincode: inputPincode,
        });
        setShowPincodeInput(false);
        setPincode('');
      } else {
        setLocationError('Invalid pincode or location not found');
      }
    } catch (error) {
      setLocationError('Failed to fetch location details');
      console.error(error);
    } finally {
      setIsLoadingPincode(false);
    }
  };

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLocationByPincode(pincode);
  };

  const handlePincodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only numbers, max 6 digits
    setPincode(value);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setActiveCategoryIndex(null);
      }
    };

    if (isLocationOpen || isUserMenuOpen || activeCategoryIndex !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLocationOpen, isUserMenuOpen, activeCategoryIndex]);

  return (
    <header className="bg-white shadow-lg">
      {/* Main Navbar */}
      <div className="mx-auto max-w-7xl border-b border-gray-100 px-4 py-1">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-10">
          {/* Logo */}
          <div className="hidden px-4 sm:block">
            <Image
              src={Logo}
              alt="ShopU - Shop Unlimited with ShopU"
              className="h-16 w-36 py-2 transition-transform hover:scale-105 md:h-20"
              width={400}
              height={80}
              priority
            />
          </div>
          <div className="px-4 sm:hidden">
            <Image
              src={Logo}
              alt="ShopU - Shop Unlimited with ShopU"
              className="h-18 w-34 py-2 md:h-20"
              width={500}
              height={80}
              priority
            />
          </div>

          {/* Location Selector - Desktop */}
          <div className="relative hidden lg:flex">
            <div
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 transition-all hover:border-teal-300 hover:shadow-md"
              onClick={toggleLocation}
            >
              <MapPin className="text-primaryColor h-5 w-5" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Deliver to</p>
                <div className="flex items-center gap-1">
                  <p className="max-w-32 truncate text-sm font-medium text-gray-800">
                    {location
                      ? typeof location.address === 'string'
                        ? location.address.split(',')[0]
                        : 'Select location'
                      : 'Select location'}
                  </p>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>
            </div>

            {isLocationOpen && (
              <div
                ref={locationRef}
                className="absolute top-full left-0 z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
              >
                <h3 className="mb-3 font-semibold text-gray-800">Select Delivery Location</h3>
                <div className="space-y-3">
                  {isLoadingLocation ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader className="text-primaryColor mr-2 h-5 w-5 animate-spin" />
                      <p className="text-gray-600">Getting your location...</p>
                    </div>
                  ) : locationError ? (
                    <div className="rounded-lg bg-red-50 p-3 text-red-600">
                      <p className="text-sm">{locationError}</p>
                      <button
                        onClick={getUserLocation}
                        className="mt-2 text-sm font-medium text-teal-600 hover:underline"
                      >
                        Try again
                      </button>
                    </div>
                  ) : location ? (
                    <div className="cursor-pointer rounded-lg border border-gray-100 p-3 transition-colors hover:bg-teal-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <MapPin className="text-PrimaaryColor mt-0.5 h-4 w-4" />
                          <div>
                            <p className="font-medium text-gray-800">
                              {typeof location.address === 'string'
                                ? location.address
                                : typeof location.address === 'object'
                                  ? `${location.address.fullName}, ${location.address.addressLine1}${location.address.addressLine2 ? ', ' + location.address.addressLine2 : ''}, ${location.address.city}, ${location.address.state}, ${location.address.postalCode}`
                                  : ''}
                            </p>
                            <p className="text-sm text-gray-600">PIN: {location.pincode}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setLocation(null);
                            setShowPincodeInput(false);
                          }}
                          className="text-primaryColor text-sm hover:underline"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {!location && (
                    <>
                      <div
                        className="cursor-pointer rounded-lg border border-gray-100 p-3 transition-colors hover:bg-teal-50"
                        onClick={getUserLocation}
                      >
                        <p className="font-medium text-gray-800">📍 Use current location</p>
                        <p className="text-sm text-gray-600">Allow location access</p>
                      </div>

                      <div
                        className="cursor-pointer rounded-lg border border-gray-100 p-3 transition-colors hover:bg-teal-50"
                        onClick={() => setShowPincodeInput(!showPincodeInput)}
                      >
                        <p className="font-medium text-gray-800">📝 Enter Pincode</p>
                        <p className="text-sm text-gray-600">Type your area pincode</p>
                      </div>
                    </>
                  )}

                  {showPincodeInput && (
                    <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                      <form onSubmit={handlePincodeSubmit} className="space-y-3">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-700">
                            Enter Pincode
                          </label>
                          <input
                            type="text"
                            value={pincode}
                            onChange={handlePincodeInputChange}
                            placeholder="e.g., 500001"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                            maxLength={6}
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={isLoadingPincode || pincode.length !== 6}
                            className="bg-background1 hover:bg-background1 flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:bg-gray-300"
                          >
                            {isLoadingPincode ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader className="h-4 w-4 animate-spin" />
                                Searching...
                              </span>
                            ) : (
                              'Find Location'
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowPincodeInput(false);
                              setPincode('');
                              setLocationError(null);
                            }}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden max-w-2xl flex-1 md:block">
            <Searchbar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* User Account */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="text-primaryColor hover:text-primaryColor hidden items-center gap-2 rounded-lg border-2 border-solid px-1 py-2 transition-colors hover:bg-gray-50 md:flex"
                >
                  <User className="h-5 w-5" />
                  <span className="text-md font-medium">Account</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
                    <div className="border-b border-gray-100 px-6 py-2">
                      <p className="font-medium text-gray-700">My Account</p>
                      <p className="text-sm text-gray-600">{phoneNumber}</p>
                    </div>
                    <div className="space-y-1 py-2">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-6 py-1 text-[0.85rem] font-medium text-red-600 hover:bg-gray-50"
                        >
                          <Shield className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        href="/account/orders"
                        className="flex items-center gap-3 px-6 py-1 text-[0.85rem] text-gray-700 hover:bg-gray-50"
                      >
                        My Orders
                      </Link>
                      <a
                        href="/account/myAddresses"
                        className="flex items-center gap-3 px-6 py-1 text-[0.85rem] text-gray-700 hover:bg-gray-50"
                      >
                        Saved Addresses
                      </a>
                      <a
                        href="/account/wishlist"
                        className="flex items-center gap-3 px-6 py-1 text-[0.85rem] text-gray-700 hover:bg-gray-50"
                      >
                        Wishlist
                      </a>
                      <Link
                        href="/account/faq"
                        className="flex items-center gap-3 px-6 py-1 text-[0.85rem] text-gray-700 hover:bg-gray-50"
                      >
                        FAQ
                      </Link>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-6 py-1 text-[0.85rem] text-gray-700 hover:bg-gray-50"
                        onClick={async e => {
                          e.preventDefault();

                          try {
                            const res = await fetch('/api/account/logout', {
                              method: 'POST',
                            });

                            const data = await res.json();

                            if (res.ok && data.success) {
                              console.log('Logged out successfully');
                              localStorage.removeItem('wishlist');
                              setIsLoggedIn(false);
                              setIsLoginModalOpen(false);
                              window.location.href = '/';
                            } else {
                              console.error('Logout failed:', data.message);
                            }
                          } catch (err) {
                            console.error('Error during logout:', err);
                          }
                        }}
                      >
                        Log Out
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-background1 hover:bg-background1 hidden items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors md:flex"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">Login</span>
              </button>
            )}

            {/* Shopping Cart */}
            <button
              onClick={openCartModal}
              className="hover:text-primaryColor relative rounded-lg p-2.5 text-gray-600 transition-colors hover:bg-gray-50"
            >
              <ShoppingCart className="h-6 w-6 text-[#317C80]" />
              {isLoadingCart ? (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                  <Loader className="h-3 w-3 animate-spin text-teal-600" />
                </span>
              ) : cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              ) : null}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="rounded-lg p-2.5 text-gray-600 transition-colors hover:bg-gray-50 md:hidden"
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
              className="focus:ring-primaryColor w-full rounded-xl border border-gray-200 px-4 py-3 pl-12 text-sm focus:border-teal-500 focus:ring-2 focus:outline-none"
            />
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-background1 hidden md:block">
        <div className="mx-auto max-w-7xl px-6">
          <div
            className="relative z-30 flex items-center justify-between gap-4 py-3"
            ref={categoriesRef}
          >
            <button
              onClick={handleClick}
              className="hover:text-primaryColor rounded-lg px-3 py-1.5 text-[15px] whitespace-nowrap text-white transition-all hover:bg-white hover:shadow-sm"
            >
              All Products
            </button>
            {categories.map((category, index) => (
              <div key={index} className="relative">
                <button
                  className="hover:text-primaryColor rounded-lg px-3 py-1.5 text-[15px] whitespace-nowrap text-white transition-all hover:bg-white hover:shadow-sm"
                  onClick={() => setActiveCategoryIndex(prev => (prev === index ? null : index))}
                >
                  {category.name}
                </button>

                {/* Show popup if current index is active */}
                {activeCategoryIndex === index && category.subcategories.length > 0 && (
                  <div className="absolute top-full left-0 z-50 mt-3 min-w-36 bg-white shadow-md">
                    {category.subcategories.map((sub, subIdx) => (
                      <button
                        key={subIdx}
                        className="hover:bg-primaryColor w-full px-3 py-2 text-left text-sm text-gray-800 hover:text-white"
                        onClick={() => {
                          console.log('Clicked:', sub);
                          setActiveCategoryIndex(null); // close dropdown after click
                        }}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div
            className="max-h-96 overflow-y-auto"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="space-y-1 p-4">
              {/* User Section */}
              {isLoggedIn ? (
                <div className="mb-4 rounded-lg bg-gray-50" ref={mobileAccountMenuRef}>
                  {/* My Account Header */}
                  <button
                    className="flex w-full items-center justify-between border-b border-gray-100 px-6 py-2 text-left"
                    onClick={() => setIsMobileAccountMenuOpen(!isMobileAccountMenuOpen)}
                  >
                    <div>
                      <p className="font-medium text-gray-700">My Account</p>
                      <p className="text-xs text-gray-600">{phoneNumber}</p>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${isMobileAccountMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {/* Dropdown List Items */}
                  {isMobileAccountMenuOpen && (
                    <div className="space-y-1 py-2">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-3 px-6 py-1 text-[0.85rem] font-medium text-red-600 hover:bg-gray-50"
                        >
                          <Shield className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      )}
                      <Link
                        href="/account/orders"
                        className="flex items-center gap-3 px-6 py-1 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        My Orders
                      </Link>
                      <a
                        href="/account/myAddresses"
                        className="flex items-center gap-3 px-6 py-1 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        Saved Addresses
                      </a>
                      <a
                        href="/account/wishlist"
                        className="flex items-center gap-3 px-6 py-1 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        Wishlist
                      </a>
                      <a
                        href="/account/faq"
                        className="flex items-center gap-3 px-6 py-1 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        FAQ
                      </a>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-6 py-1 text-xs text-gray-700 hover:bg-gray-50"
                        onClick={async e => {
                          e.preventDefault();

                          try {
                            const res = await fetch('/api/account/logout', {
                              method: 'POST',
                            });

                            const data = await res.json();

                            if (res.ok && data.success) {
                              console.log('Logged out successfully');
                              localStorage.removeItem('wishlist');
                              setIsLoggedIn(false);
                              setIsLoginModalOpen(false);
                              window.location.href = '/';
                            } else {
                              console.error('Logout failed:', data.message);
                            }
                          } catch (err) {
                            console.error('Error during logout:', err);
                          }
                        }}
                      >
                        Log Out
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="hover:bg-background1 flex w-full items-center gap-2 rounded-lg bg-teal-600 p-3 text-white"
                >
                  <span className="text-sm font-medium">Login</span>
                </button>
              )}

              {/* Location */}
              <div className="rounded-lg border border-gray-200 p-3">
                <button
                  className="flex w-full items-center gap-2 text-left"
                  onClick={getUserLocation}
                >
                  <MapPin className="text-primaryColor h-4 w-4" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">Delivery Location</p>
                    <p className="truncate text-xs text-gray-600">
                      {isLoadingLocation
                        ? 'Getting location...'
                        : location
                          ? typeof location.address === 'string'
                            ? location.address
                            : `${location.address.fullName}, ${location.address.addressLine1}${location.address.addressLine2 ? ', ' + location.address.addressLine2 : ''}, ${location.address.city}, ${location.address.state}, ${location.address.postalCode}`
                          : 'Select your location'}
                    </p>
                  </div>
                </button>

                {!location && (
                  <div className="mt-3 border-t pt-3">
                    <button
                      onClick={() => setShowPincodeInput(!showPincodeInput)}
                      className="text-primaryColor w-full rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium hover:bg-teal-100"
                    >
                      📝 Enter Pincode Instead
                    </button>

                    {showPincodeInput && (
                      <form onSubmit={handlePincodeSubmit} className="mt-3 space-y-2">
                        <input
                          type="text"
                          value={pincode}
                          onChange={handlePincodeInputChange}
                          placeholder="Enter 6-digit pincode"
                          className="focus:border-primaryColor focus:ring-primaryColor w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-1 focus:outline-none"
                          maxLength={6}
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={isLoadingPincode || pincode.length !== 6}
                            className="flex-1 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white disabled:bg-gray-300"
                          >
                            {isLoadingPincode ? 'Finding...' : 'Find'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowPincodeInput(false);
                              setPincode('');
                            }}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {locationError && <p className="mt-2 text-sm text-red-600">{locationError}</p>}
                  </div>
                )}
              </div>

              {/* Categories */}
              <div className="border-t pt-3">
                <p className="mb-2 text-xs font-semibold tracking-wider text-gray-700 uppercase">
                  Categories
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className="rounded-lg border border-gray-200 p-2 text-left text-xs text-gray-700 hover:border-teal-200 hover:bg-teal-50"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onPhoneChange={value => {
          console.log(value);
          setPhoneNumber(value);
        }}
      />
    </header>
  );
};

export default Header;
