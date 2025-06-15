// // 'use client';
// // import React, { useState, useRef, useEffect } from 'react';
// // import { Search, ShoppingCart, User, MapPin, Menu, X, Loader } from 'lucide-react';
// // import Image from 'next/image';
// // import Logo from '../../public/Shop U Logo-02.jpg';
// // import LoginModal from './LoginModal';
// // import Searchbar from './SearchBar';

// // const Header = () => {
// //   const [isMenuOpen, setIsMenuOpen] = useState(false);
// //   const [isLocationOpen, setIsLocationOpen] = useState(false);
// //   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
// //   const [isLoggedIn, setIsLoggedIn] = useState(false);
// //   const [location, setLocation] = useState<{address: string; pincode: string} | null>(null);
// //   const [isLoadingLocation, setIsLoadingLocation] = useState(false);
// //   const [locationError, setLocationError] = useState<string | null>(null);
// //   const locationRef = useRef<HTMLDivElement>(null);

// //   const checkLoginStatus = async () => {
// //     try {
// //       const res = await fetch('/api/account/is-logged-in');
// //       const data = await res.json();
// //       setIsLoggedIn(data.loggedIn);
// //     } catch {
// //       setIsLoggedIn(false);
// //     }
// //   };

// //   // Check login status when modal closes
// //   useEffect(() => {
// //     if (!isLoginModalOpen) {
// //       checkLoginStatus();
// //     }
// //   }, [isLoginModalOpen]);

// //   const categories = [
// //     'All Products',
// //     'Baby Care',
// //     'Nutritional Drinks & Supplements',
// //     'Women Care',
// //     'Personal Care',
// //     'Ayurveda',
// //     'Health Devices',
// //     'Home Essentials',
// //     'Health Condition',
// //   ];

// //   const toggleMenu = () => {
// //     setIsMenuOpen(!isMenuOpen);
// //   };

// //   const toggleLocation = () => {
// //     setIsLocationOpen(!isLocationOpen);
    
// //     // If opening the location dropdown and no location yet, get user's location
// //     if (!isLocationOpen && !location && !isLoadingLocation) {
// //       getUserLocation();
// //     }
// //   };
  
// //   const getUserLocation = () => {
// //     setIsLoadingLocation(true);
// //     setLocationError(null);
    
// //     if (!navigator.geolocation) {
// //       setLocationError("Geolocation is not supported by your browser");
// //       setIsLoadingLocation(false);
// //       return;
// //     }
    
// //     navigator.geolocation.getCurrentPosition(
// //       async (position) => {
// //         try {
// //           const { latitude, longitude } = position.coords;
// //           // Use Nominatim OpenStreetMap API for reverse geocoding (free and no API key required)
// //           const response = await fetch(
// //             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
// //           );
          
// //           if (!response.ok) {
// //             throw new Error('Failed to fetch address');
// //           }
          
// //           const data = await response.json();
          
// //           // Extract location data
// //           const address = data.display_name.split(',').slice(0, 2).join(',');
// //           const pincode = data.address.postcode || 'Unknown';
          
// //           setLocation({ address, pincode });
// //         } catch (error) {
// //           setLocationError("Failed to get your location details");
// //           console.error(error);
// //         } finally {
// //           setIsLoadingLocation(false);
// //         }
// //       },
// //       (error) => {
// //         console.error(error);
// //         setLocationError("Unable to retrieve your location");
// //         setIsLoadingLocation(false);
// //       },
// //       { enableHighAccuracy: true }
// //     );
// //   };

// //   // Close the location dropdown on outside click
// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
// //         setIsLocationOpen(false);
// //       }
// //     };

// //     if (isLocationOpen) {
// //       document.addEventListener('mousedown', handleClickOutside);
// //     }

// //     return () => {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, [isLocationOpen]);

// //   return (
// //     <nav className="bg-white shadow-lg">
// //       {/* Main Navbar */}
// //       <div className="border-b border-gray-200 px-2">
// //         <div className="mx-auto flex max-w-7xl items-center justify-between space-x-4">
// //           {/* Logo */}
// //           <div className="flex-shrink-0">
// //             <Image
// //               src={Logo}
// //               alt="ShopU - Shop Unlimited with ShopU"
// //               className="h-24 w-auto md:h-28"
// //               width={280}
// //               height={120}
// //             />
// //           </div>

// //           {/* Location Selector */}
// //           <div className="relative hidden items-center space-x-2 md:flex">
// //             <MapPin className="h-5 w-5 text-gray-600" />
// //             <div className="cursor-pointer" onClick={toggleLocation}>
// //               <p className="text-xs text-gray-500">Delivery Address</p>
// //               <p className="text-sm font-medium text-gray-800">
// //                 {location ? location.address : "Select Address"} ▼
// //               </p>
// //             </div>
// //             {isLocationOpen && (
// //               <div
// //                 ref={locationRef}
// //                 className="absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border bg-white p-4 shadow-lg"
// //               >
// //                 <h3 className="mb-2 font-semibold">Select Delivery Location</h3>
// //                 <div className="space-y-2">
// //                   {isLoadingLocation ? (
// //                     <div className="flex items-center justify-center py-4">
// //                       <Loader className="h-5 w-5 animate-spin text-teal-600 mr-2" />
// //                       <p>Getting your location...</p>
// //                     </div>
// //                   ) : locationError ? (
// //                     <div className="p-2 text-red-500">
// //                       <p>{locationError}</p>
// //                       <button 
// //                         onClick={getUserLocation}
// //                         className="mt-2 text-teal-600 text-sm hover:underline"
// //                       >
// //                         Try again
// //                       </button>
// //                     </div>
// //                   ) : location ? (
// //                     <div className="cursor-pointer rounded p-2 hover:bg-gray-100">
// //                       <p className="font-medium">{location.address}</p>
// //                       <p className="text-sm text-gray-600">{location.pincode}</p>
// //                     </div>
// //                   ) : (
// //                     <div className="cursor-pointer rounded p-2 hover:bg-gray-100" onClick={getUserLocation}>
// //                       <p className="font-medium">Use current location</p>
// //                       <p className="text-sm text-gray-600">Allow location access</p>
// //                     </div>
// //                   )}
                  
// //                   <div className="cursor-pointer rounded p-2 hover:bg-gray-100">
// //                     <p className="font-medium">Add New Address</p>
// //                     <p className="text-sm text-gray-600">Enter your pincode</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             )}
// //           </div>

// //           {/* Search Bar */}
// //           <Searchbar />

// //           {/* Right Actions */}
// //           <div className="flex items-center space-x-4">
// //             {isLoggedIn ? (
// //               <button className="hidden items-center space-x-1 px-4 py-2 text-gray-700 transition-colors hover:text-teal-600 md:flex">
// //                 <User className="h-5 w-5" />
// //                 <span className="text-sm">Account</span>
// //               </button>
// //             ) : (
// //               <button
// //                 onClick={() => setIsLoginModalOpen(true)}
// //                 className="hidden items-center space-x-1 px-4 py-2 text-gray-700 transition-colors hover:text-teal-600 md:flex"
// //               >
// //                 <User className="h-5 w-5" />
// //                 <span className="text-sm">Login</span>
// //               </button>
// //             )}

// //             <button className="relative p-2 text-gray-700 transition-colors hover:text-teal-600">
// //               <ShoppingCart className="h-6 w-6" />
// //               <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-xs text-white">
// //                 0
// //               </span>
// //             </button>

// //             {/* Mobile Menu Button */}
// //             <button
// //               className="p-2 text-gray-700 transition-colors hover:text-teal-600 md:hidden"
// //               onClick={toggleMenu}
// //             >
// //               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
// //             </button>
// //           </div>
// //         </div>

// //         {/* Mobile Search */}
// //         <div className="mt-4 md:hidden">
// //           <div className="relative">
// //             <input
// //               type="text"
// //               placeholder="Search essentials, groceries and more..."
// //               className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-transparent focus:ring-2 focus:ring-teal-500 focus:outline-none"
// //             />
// //             <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
// //           </div>
// //         </div>
// //       </div>

// //       {/* Categories Navigation */}
// //       <div className="hidden bg-gray-600 text-white md:block">
// //         <div className="mx-auto max-w-7xl px-4">
// //           <div className="no-scrollbar flex items-center space-x-8 overflow-x-auto py-3">
// //             {categories.map((category, index) => (
// //               <button
// //                 key={index}
// //                 className="rounded px-2 py-1 text-sm whitespace-nowrap transition-colors hover:text-teal-300"
// //               >
// //                 {category}
// //               </button>
// //             ))}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Mobile Menu */}
// //       {isMenuOpen && (
// //         <div className="border-t bg-white md:hidden">
// //           <div className="space-y-2 px-4 py-2">
// //             {isLoggedIn ? (
// //               <button className="flex w-full items-center space-x-2 rounded p-2 text-left hover:bg-gray-100">
// //                 <User className="h-5 w-5" />
// //                 <span>Account</span>
// //               </button>
// //             ) : (
// //               <button
// //                 onClick={() => {
// //                   setIsLoginModalOpen(true);
// //                   setIsMenuOpen(false);
// //                 }}
// //                 className="flex w-full items-center space-x-2 rounded p-2 text-left hover:bg-gray-100"
// //               >
// //                 <User className="h-5 w-5" />
// //                 <span>Login</span>
// //               </button>
// //             )}

// //             <div className="border-t pt-2">
// //               <p className="mb-2 text-sm font-medium text-gray-700">Categories</p>
// //               {categories.map((category, index) => (
// //                 <button
// //                   key={index}
// //                   className="block w-full rounded p-2 text-left text-sm text-gray-600 hover:bg-gray-100"
// //                 >
// //                   {category}
// //                 </button>
// //               ))}
// //             </div>

// //             <div className="border-t pt-2">
// //               <button 
// //                 className="flex w-full items-center space-x-2 rounded p-2 text-left hover:bg-gray-100"
// //                 onClick={getUserLocation}
// //               >
// //                 <MapPin className="h-5 w-5" />
// //                 <div>
// //                   <p className="text-sm font-medium">Delivery Address</p>
// //                   <p className="text-xs text-gray-600">
// //                     {isLoadingLocation ? "Getting location..." : location ? location.address : "Select your location"}
// //                   </p>
// //                 </div>
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Login Modal */}
// //       <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
// //     </nav>
// //   );
// // };

// // export default Header;


// 'use client';
// import React, { useState, useRef, useEffect } from 'react';
// import { Search, ShoppingCart, User, MapPin, Menu, X, Loader, ChevronDown, Heart, Bell } from 'lucide-react';
// import Image from 'next/image';
// import Logo from '../../public/Shop U Logo-02.jpg';
// import LoginModal from './LoginModal';
// import Searchbar from './SearchBar';

// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isLocationOpen, setIsLocationOpen] = useState(false);
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [location, setLocation] = useState<{address: string; pincode: string} | null>(null);
//   const [isLoadingLocation, setIsLoadingLocation] = useState(false);
//   const [locationError, setLocationError] = useState<string | null>(null);
//   const [cartCount, setCartCount] = useState(3); // Mock cart count
//   const [pincode, setPincode] = useState('');
//   const [isLoadingPincode, setIsLoadingPincode] = useState(false);
//   const [showPincodeInput, setShowPincodeInput] = useState(false);
//   const locationRef = useRef<HTMLDivElement>(null);
//   const userMenuRef = useRef<HTMLDivElement>(null);

//   const checkLoginStatus = async () => {
//     try {
//       const res = await fetch('/api/account/is-logged-in');
//       const data = await res.json();
//       setIsLoggedIn(data.loggedIn);
//     } catch {
//       setIsLoggedIn(false);
//     }
//   };

//   // Check login status when modal closes
//   useEffect(() => {
//     if (!isLoginModalOpen) {
//       checkLoginStatus();
//     }
//   }, [isLoginModalOpen]);

//   const categories = [
//     'All Products',
//     'Baby Care',
//     'Nutritional Drinks',
//     'Women Care',
//     'Personal Care',
//     'Ayurveda',
//     'Health Devices',
//     'Home Essentials',
//     'Health Condition',
//   ];

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const toggleLocation = () => {
//     setIsLocationOpen(!isLocationOpen);
    
//     if (!isLocationOpen && !location && !isLoadingLocation) {
//       getUserLocation();
//     }
//   };

//   const toggleUserMenu = () => {
//     setIsUserMenuOpen(!isUserMenuOpen);
//   };
  
//   const getUserLocation = () => {
//     setIsLoadingLocation(true);
//     setLocationError(null);
    
//     if (!navigator.geolocation) {
//       setLocationError("Geolocation is not supported by your browser");
//       setIsLoadingLocation(false);
//       return;
//     }
    
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         try {
//           const { latitude, longitude } = position.coords;
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
//           );
          
//           if (!response.ok) {
//             throw new Error('Failed to fetch address');
//           }
          
//           const data = await response.json();
          
//           const address = data.display_name.split(',').slice(0, 2).join(', ');
//           const pincode = data.address.postcode || 'Unknown';
          
//           setLocation({ address, pincode });
//           setShowPincodeInput(false);
//         } catch (error) {
//           setLocationError("Failed to get your location details");
//           console.error(error);
//         } finally {
//           setIsLoadingLocation(false);
//         }
//       },
//       (error) => {
//         console.error(error);
//         setLocationError("Unable to retrieve your location");
//         setIsLoadingLocation(false);
//       },
//       { enableHighAccuracy: true }
//     );
//   };

//   const fetchLocationByPincode = async (inputPincode: string) => {
//     if (!inputPincode || inputPincode.length < 6) {
//       setLocationError("Please enter a valid 6-digit pincode");
//       return;
//     }

//     setIsLoadingPincode(true);
//     setLocationError(null);

//     try {
//       // Using India Post API for pincode lookup
//       const response = await fetch(`https://api.postalpincode.in/pincode/${inputPincode}`);
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch location');
//       }

//       const data = await response.json();
      
//       if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
//         const postOffice = data[0].PostOffice[0];
//         const address = `${postOffice.Name}, ${postOffice.District}, ${postOffice.State}`;
        
//         setLocation({ 
//           address, 
//           pincode: inputPincode 
//         });
//         setShowPincodeInput(false);
//         setPincode('');
//       } else {
//         setLocationError("Invalid pincode or location not found");
//       }
//     } catch (error) {
//       setLocationError("Failed to fetch location details");
//       console.error(error);
//     } finally {
//       setIsLoadingPincode(false);
//     }
//   };

//   const handlePincodeSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     fetchLocationByPincode(pincode);
//   };

//   const handlePincodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only numbers, max 6 digits
//     setPincode(value);
//   };

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
//         setIsLocationOpen(false);
//       }
//       if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
//         setIsUserMenuOpen(false);
//       }
//     };

//     if (isLocationOpen || isUserMenuOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [isLocationOpen, isUserMenuOpen]);

//   return (
//     <header className=" bg-white shadow-lg">
    

//       {/* Main Navbar */}
//       <div className="border-b border-gray-100 px-4 py-3">
//         <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Image
//               src={Logo}
//               alt="ShopU - Shop Unlimited with ShopU"
//               className="h-16 w-auto transition-transform hover:scale-105 md:h-20"
//               width={200}
//               height={80}
//               priority
//             />
//           </div>

//           {/* Location Selector - Desktop */}
//           <div className="relative hidden lg:flex">
//             <div 
//               className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 transition-all hover:border-teal-300 hover:shadow-md"
//               onClick={toggleLocation}
//             >
//               <MapPin className="h-5 w-5 text-teal-600" />
//               <div className="min-w-0">
//                 <p className="text-xs text-gray-500">Deliver to</p>
//                 <div className="flex items-center gap-1">
//                   <p className="truncate text-sm font-medium text-gray-800 max-w-32">
//                     {location ? location.address.split(',')[0] : "Select location"}
//                   </p>
//                   <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
//                 </div>
//               </div>
//             </div>
            
//             {isLocationOpen && (
//               <div
//                 ref={locationRef}
//                 className="absolute top-full left-0 z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-xl"
//               >
//                 <h3 className="mb-3 font-semibold text-gray-800">Select Delivery Location</h3>
//                 <div className="space-y-3">
//                   {isLoadingLocation ? (
//                     <div className="flex items-center justify-center py-6">
//                       <Loader className="mr-2 h-5 w-5 animate-spin text-teal-600" />
//                       <p className="text-gray-600">Getting your location...</p>
//                     </div>
//                   ) : locationError ? (
//                     <div className="rounded-lg bg-red-50 p-3 text-red-600">
//                       <p className="text-sm">{locationError}</p>
//                       <button 
//                         onClick={getUserLocation}
//                         className="mt-2 text-sm font-medium text-teal-600 hover:underline"
//                       >
//                         Try again
//                       </button>
//                     </div>
//                   ) : location ? (
//                     <div className="cursor-pointer rounded-lg border border-gray-100 p-3 transition-colors hover:bg-teal-50">
//                       <div className="flex items-start justify-between">
//                         <div className="flex items-start gap-2">
//                           <MapPin className="mt-0.5 h-4 w-4 text-teal-600" />
//                           <div>
//                             <p className="font-medium text-gray-800">{location.address}</p>
//                             <p className="text-sm text-gray-600">PIN: {location.pincode}</p>
//                           </div>
//                         </div>
//                         <button 
//                           onClick={() => {
//                             setLocation(null);
//                             setShowPincodeInput(false);
//                           }}
//                           className="text-sm text-teal-600 hover:underline"
//                         >
//                           Change
//                         </button>
//                       </div>
//                     </div>
//                   ) : null}
                  
//                   {!location && (
//                     <>
//                       <div className="cursor-pointer rounded-lg border border-gray-100 p-3 transition-colors hover:bg-teal-50" onClick={getUserLocation}>
//                         <p className="font-medium text-gray-800">📍 Use current location</p>
//                         <p className="text-sm text-gray-600">Allow location access</p>
//                       </div>
                      
//                       <div className="cursor-pointer rounded-lg border border-gray-100 p-3 transition-colors hover:bg-teal-50" onClick={() => setShowPincodeInput(!showPincodeInput)}>
//                         <p className="font-medium text-gray-800">📝 Enter Pincode</p>
//                         <p className="text-sm text-gray-600">Type your area pincode</p>
//                       </div>
//                     </>
//                   )}

//                   {showPincodeInput && (
//                     <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
//                       <form onSubmit={handlePincodeSubmit} className="space-y-3">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Enter Pincode
//                           </label>
//                           <input
//                             type="text"
//                             value={pincode}
//                             onChange={handlePincodeInputChange}
//                             placeholder="e.g., 500001"
//                             className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
//                             maxLength={6}
//                             required
//                           />
//                         </div>
//                         <div className="flex gap-2">
//                           <button
//                             type="submit"
//                             disabled={isLoadingPincode || pincode.length !== 6}
//                             className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:bg-gray-300"
//                           >
//                             {isLoadingPincode ? (
//                               <span className="flex items-center justify-center gap-2">
//                                 <Loader className="h-4 w-4 animate-spin" />
//                                 Searching...
//                               </span>
//                             ) : (
//                               'Find Location'
//                             )}
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setShowPincodeInput(false);
//                               setPincode('');
//                               setLocationError(null);
//                             }}
//                             className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </form>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Search Bar - Desktop */}
//           <div className="hidden flex-1 max-w-2xl md:block">
//             <Searchbar />
//           </div>

//           {/* Right Actions */}
//           <div className="flex items-center gap-2">
//             {/* Wishlist - Desktop */}
//             <button className="hidden items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-teal-600 lg:flex">
//               <Heart className="h-5 w-5" />
//               <span className="text-sm font-medium">Wishlist</span>
//             </button>

//             {/* User Account */}
//             {isLoggedIn ? (
//               <div className="relative" ref={userMenuRef}>
//                 <button 
//                   onClick={toggleUserMenu}
//                   className="hidden items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-teal-600 md:flex"
//                 >
//                   <User className="h-5 w-5" />
//                   <span className="text-sm font-medium">Account</span>
//                   <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
//                 </button>

//                 {isUserMenuOpen && (
//                   <div className="absolute top-full right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
//                     <div className="px-4 py-2 border-b border-gray-100">
//                       <p className="font-medium text-gray-800">Hello, User!</p>
//                       <p className="text-sm text-gray-600">user@example.com</p>
//                     </div>
//                     <div className="py-1">
//                       <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                         <User className="h-4 w-4" />
//                         My Profile
//                       </a>
//                       <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                         <ShoppingCart className="h-4 w-4" />
//                         My Orders
//                       </a>
//                       <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                         <Heart className="h-4 w-4" />
//                         My Wishlist
//                       </a>
//                       <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
//                         <Bell className="h-4 w-4" />
//                         Notifications
//                       </a>
//                       <hr className="my-1" />
//                       <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
//                         Logout
//                       </a>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <button
//                 onClick={() => setIsLoginModalOpen(true)}
//                 className="hidden items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700 md:flex"
//               >
//                 <User className="h-5 w-5" />
//                 <span className="text-sm font-medium">Login</span>
//               </button>
//             )}

//             {/* Shopping Cart */}
//             <button className="relative rounded-lg p-2.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-teal-600">
//               <ShoppingCart className="h-6 w-6" />
//               {cartCount > 0 && (
//                 <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
//                   {cartCount > 99 ? '99+' : cartCount}
//                 </span>
//               )}
//             </button>

//             {/* Mobile Menu Button */}
//             <button
//               className="rounded-lg p-2.5 text-gray-600 transition-colors hover:bg-gray-50 md:hidden"
//               onClick={toggleMenu}
//             >
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Search */}
//         <div className="mt-4 md:hidden">
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search essentials, groceries and more..."
//               className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-12 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
//             />
//             <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
//           </div>
//         </div>
//       </div>

//       {/* Categories Navigation */}
//       <div className="hidden border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 md:block">
//         <div className="mx-auto max-w-7xl px-4">
//           <div className="flex items-center gap-8 overflow-x-auto py-3" style={{
//             scrollbarWidth: 'none',
//             msOverflowStyle: 'none',
//             WebkitScrollbar: { display: 'none' }
//           }}>
//             {categories.map((category, index) => (
//               <button
//                 key={index}
//                 className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:bg-white hover:text-teal-600 hover:shadow-sm"
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="border-t border-gray-100 bg-white md:hidden">
//           <div className="max-h-96 overflow-y-auto" style={{
//             scrollbarWidth: 'none',
//             msOverflowStyle: 'none'
//           }}>
//             <style jsx>{`
//               div::-webkit-scrollbar {
//                 display: none;
//               }
//             `}</style>
//             <div className="space-y-1 p-4">
//               {/* User Section */}
//               {isLoggedIn ? (
//                 <div className="mb-4 rounded-lg bg-gray-50 p-4">
//                   <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white">
//                       <User className="h-5 w-5" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-800">Hello, User!</p>
//                       <p className="text-sm text-gray-600">user@example.com</p>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <button
//                   onClick={() => {
//                     setIsLoginModalOpen(true);
//                     setIsMenuOpen(false);
//                   }}
//                   className="flex w-full items-center gap-3 rounded-lg bg-teal-600 p-3 text-white hover:bg-teal-700"
//                 >
//                   <User className="h-5 w-5" />
//                   <span className="font-medium">Login / Sign Up</span>
//                 </button>
//               )}

//               {/* Location */}
//               <div className="rounded-lg border border-gray-200 p-3">
//                 <button 
//                   className="flex w-full items-center gap-3 text-left"
//                   onClick={getUserLocation}
//                 >
//                   <MapPin className="h-5 w-5 text-teal-600" />
//                   <div className="min-w-0 flex-1">
//                     <p className="font-medium text-gray-800">Delivery Location</p>
//                     <p className="truncate text-sm text-gray-600">
//                       {isLoadingLocation ? "Getting location..." : location ? location.address : "Select your location"}
//                     </p>
//                   </div>
//                 </button>
                
//                 {!location && (
//                   <div className="mt-3 border-t pt-3">
//                     <button
//                       onClick={() => setShowPincodeInput(!showPincodeInput)}
//                       className="w-full rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 hover:bg-teal-100"
//                     >
//                       📝 Enter Pincode Instead
//                     </button>
                    
//                     {showPincodeInput && (
//                       <form onSubmit={handlePincodeSubmit} className="mt-3 space-y-2">
//                         <input
//                           type="text"
//                           value={pincode}
//                           onChange={handlePincodeInputChange}
//                           placeholder="Enter 6-digit pincode"
//                           className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
//                           maxLength={6}
//                         />
//                         <div className="flex gap-2">
//                           <button
//                             type="submit"
//                             disabled={isLoadingPincode || pincode.length !== 6}
//                             className="flex-1 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white disabled:bg-gray-300"
//                           >
//                             {isLoadingPincode ? "Finding..." : "Find"}
//                           </button>
//                           <button
//                             type="button"
//                             onClick={() => {
//                               setShowPincodeInput(false);
//                               setPincode('');
//                             }}
//                             className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       </form>
//                     )}
                    
//                     {locationError && (
//                       <p className="mt-2 text-sm text-red-600">{locationError}</p>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Wishlist */}
//               <button className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-gray-50">
//                 <Heart className="h-5 w-5 text-teal-600" />
//                 <span className="font-medium text-gray-800">Wishlist</span>
//               </button>

//               {/* Categories */}
//               <div className="border-t pt-4">
//                 <p className="mb-3 text-sm font-semibold text-gray-700">Categories</p>
//                 <div className="grid grid-cols-2 gap-2">
//                   {categories.map((category, index) => (
//                     <button
//                       key={index}
//                       className="rounded-lg border border-gray-200 p-2 text-left text-sm text-gray-700 hover:bg-teal-50 hover:border-teal-200"
//                     >
//                       {category}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Login Modal */}
//       <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
//     </header>
//   );
// };

// export default Header;



'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, MapPin, Menu, X, Loader, ChevronDown, Bell } from 'lucide-react';
import Image from 'next/image';
import Logo from '../../public/Shop U Logo-02.jpg';
import LoginModal from './LoginModal';
import Searchbar from './SearchBar';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [location, setLocation] = useState<{address: string; pincode: string} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [cartCount] = useState(3); // Mock cart count
  const [pincode, setPincode] = useState('');
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const [showPincodeInput, setShowPincodeInput] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
    'Nutritional Drinks',
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
    
    if (!isLocationOpen && !location && !isLoadingLocation) {
      getUserLocation();
    }
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
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

  const fetchLocationByPincode = async (inputPincode: string) => {
    if (!inputPincode || inputPincode.length < 6) {
      setLocationError("Please enter a valid 6-digit pincode");
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
          pincode: inputPincode 
        });
        setShowPincodeInput(false);
        setPincode('');
      } else {
        setLocationError("Invalid pincode or location not found");
      }
    } catch (error) {
      setLocationError("Failed to fetch location details");
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
    };

    if (isLocationOpen || isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLocationOpen, isUserMenuOpen]);

  return (
    <header className="bg-white shadow-lg">
   

      {/* Main Navbar */}
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image
              src={Logo}
              alt="ShopU - Shop Unlimited with ShopU"
              className="h-16 w-auto transition-transform hover:scale-105 md:h-20"
              width={200}
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
              <MapPin className="h-5 w-5 text-teal-600" />
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Deliver to</p>
                <div className="flex items-center gap-1">
                  <p className="truncate text-sm font-medium text-gray-800 max-w-32">
                    {location ? location.address.split(',')[0] : "Select location"}
                  </p>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
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
                      <Loader className="mr-2 h-5 w-5 animate-spin text-teal-600" />
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
                          <MapPin className="mt-0.5 h-4 w-4 text-teal-600" />
                          <div>
                            <p className="font-medium text-gray-800">{location.address}</p>
                            <p className="text-sm text-gray-600">PIN: {location.pincode}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setLocation(null);
                            setShowPincodeInput(false);
                          }}
                          className="text-sm text-teal-600 hover:underline"
                        >
                          Change
                        </button>
                      </div>
                    </div>
                  ) : null}
                  
                  {!location && (
                    <>
                      <div className="cursor-pointer rounded-lg border border-gray-100 p-3 transition-colors hover:bg-teal-50" onClick={getUserLocation}>
                        <p className="font-medium text-gray-800">📍 Use current location</p>
                        <p className="text-sm text-gray-600">Allow location access</p>
                      </div>
                      
                      <div className="cursor-pointer rounded-lg border border-gray-100 p-3 transition-colors hover:bg-teal-50" onClick={() => setShowPincodeInput(!showPincodeInput)}>
                        <p className="font-medium text-gray-800">📝 Enter Pincode</p>
                        <p className="text-sm text-gray-600">Type your area pincode</p>
                      </div>
                    </>
                  )}

                  {showPincodeInput && (
                    <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                      <form onSubmit={handlePincodeSubmit} className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Enter Pincode
                          </label>
                          <input
                            type="text"
                            value={pincode}
                            onChange={handlePincodeInputChange}
                            placeholder="e.g., 500001"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            maxLength={6}
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={isLoadingPincode || pincode.length !== 6}
                            className="flex-1 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:bg-gray-300"
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
          <div className="hidden flex-1 max-w-2xl md:block">
            <Searchbar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
        
            {/* User Account */}
            {isLoggedIn ? (
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={toggleUserMenu}
                  className="hidden items-center gap-2 rounded-lg px-3 py-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-teal-600 md:flex"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Account</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-gray-800">Hello, User!</p>
                      <p className="text-sm text-gray-600">user@example.com</p>
                    </div>
                    <div className="py-1">
                      <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <User className="h-4 w-4" />
                        My Profile
                      </a>
                      <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <ShoppingCart className="h-4 w-4" />
                        My Orders
                      </a>
                   
                      <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Bell className="h-4 w-4" />
                        Notifications
                      </a>
                      <hr className="my-1" />
                      <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Logout
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white transition-colors hover:bg-teal-700 md:flex"
              >
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">Login</span>
              </button>
            )}

            {/* Shopping Cart */}
            <button className="relative rounded-lg p-2.5 text-gray-600 transition-colors hover:bg-gray-50 hover:text-teal-600">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
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
              className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-12 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="hidden border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 md:block">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-8 overflow-x-auto py-3" style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {categories.map((category, index) => (
              <button
                key={index}
                className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:bg-white hover:text-teal-600 hover:shadow-sm"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <div className="max-h-96 overflow-y-auto" style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="space-y-1 p-4">
              {/* User Section */}
              {isLoggedIn ? (
                <div className="mb-4 rounded-lg bg-gray-50 p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Hello, User!</p>
                      <p className="text-xs text-gray-600">user@example.com</p>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg bg-teal-600 p-3 text-white hover:bg-teal-700"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Login / Sign Up</span>
                </button>
              )}

              {/* Location */}
              <div className="rounded-lg border border-gray-200 p-3">
                <button 
                  className="flex w-full items-center gap-2 text-left"
                  onClick={getUserLocation}
                >
                  <MapPin className="h-4 w-4 text-teal-600" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800">Delivery Location</p>
                    <p className="truncate text-xs text-gray-600">
                      {isLoadingLocation ? "Getting location..." : location ? location.address : "Select your location"}
                    </p>
                  </div>
                </button>
                
                {!location && (
                  <div className="mt-3 border-t pt-3">
                    <button
                      onClick={() => setShowPincodeInput(!showPincodeInput)}
                      className="w-full rounded-lg bg-teal-50 px-3 py-2 text-sm font-medium text-teal-700 hover:bg-teal-100"
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
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          maxLength={6}
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={isLoadingPincode || pincode.length !== 6}
                            className="flex-1 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white disabled:bg-gray-300"
                          >
                            {isLoadingPincode ? "Finding..." : "Find"}
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
                    
                    {locationError && (
                      <p className="mt-2 text-sm text-red-600">{locationError}</p>
                    )}
                  </div>
                )}
              </div>

           

              {/* Categories */}
              <div className="border-t pt-3">
                <p className="mb-2 text-xs font-semibold text-gray-700 uppercase tracking-wider">Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category, index) => (
                    <button
                      key={index}
                      className="rounded-lg border border-gray-200 p-2 text-left text-xs text-gray-700 hover:bg-teal-50 hover:border-teal-200"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
};

export default Header;