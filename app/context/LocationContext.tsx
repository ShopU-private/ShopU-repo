'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationType {
  address: string;
  pincode: string;
}

interface LocationContextType {
  location: LocationType | null;
  setLocation: React.Dispatch<React.SetStateAction<LocationType | null>>;
  isLoadingLocation: boolean;
  setIsLoadingLocation: React.Dispatch<React.SetStateAction<boolean>>;
  locationError: string | null;
  setLocationError: React.Dispatch<React.SetStateAction<string | null>>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // Try to load from localStorage on mount (client-side only)
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        setLocation(JSON.parse(savedLocation));
      } catch (e) {
        console.error('Failed to parse saved location', e);
      }
    }
  }, []);

  // Save location to localStorage when it changes
  useEffect(() => {
    if (location) {
      localStorage.setItem('userLocation', JSON.stringify(location));
    }
  }, [location]);

  return (
    <LocationContext.Provider value={{
      location,
      setLocation,
      isLoadingLocation,
      setIsLoadingLocation,
      locationError,
      setLocationError
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
