'use client';

import { LocationContextType, LocationType } from '@shopu/types-store/types';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const defaultContextValue: LocationContextType = {
  location: null,
  setLocation: () => { },
  addressId: null,
  setAddressId: () => { },
};

const LocationContext = createContext<LocationContextType>(defaultContextValue);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [location, setLocation] = useState<LocationType | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('userLocation');
      if (!stored) return null;
      const parsed: LocationType = JSON.parse(stored);
      if (parsed && parsed.address) {
        console.log('Loaded location from localStorage:', parsed);
        return parsed;
      }
    } catch (err) {
      console.error('Failed to parse userLocation:', err);
      localStorage.removeItem('userLocation');
    }
    return null;
  });
  const [addressId, setAddressId] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Function to set full address
  const setFullAddress = (newLocation: LocationType) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userLocation', JSON.stringify(newLocation));
        console.log('Saved full address to localStorage:', newLocation);
      }
    } catch (error) {
      console.error('Failed to save location to localStorage:', error);
    }

    setLocation(newLocation);
  };

  // Sync changes to localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || !location) return;

    try {
      localStorage.setItem('userLocation', JSON.stringify(location));
    } catch (err) {
      console.error('Failed to sync location to localStorage:', err);
    }
  }, [location]);

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        isLoadingLocation,
        setIsLoadingLocation,
        locationError,
        setLocationError,
        addressId,
        setAddressId,
        setFullAddress,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
