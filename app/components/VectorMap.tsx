'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

export interface MapRef {
  updateLocation: (lat: number, lng: number, address?: string) => void;
  getCenter: () => { lat: number; lng: number };
}

interface VectorMapProps {
  onLocationChange?: (lat: number, lng: number) => void;
}

const VectorMap = forwardRef<MapRef, VectorMapProps>(({ onLocationChange }, ref) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useImperativeHandle(ref, () => ({
    updateLocation: (lat: number, lng: number, address?: string) => {
      if (mapInstance.current) {
        // Update map center
        mapInstance.current.setCenter({ lat, lng });
        mapInstance.current.setZoom(15);

        // Remove existing marker
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        // Add new marker
        markerRef.current = new google.maps.Marker({
          position: { lat, lng },
          map: mapInstance.current,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#0d9488",
            fillOpacity: 1,
            strokeWeight: 1,
          },
        });

        // Add info window with address if provided
        if (address) {
          const infowindow = new google.maps.InfoWindow({
            content: `<div class="p-2 text-sm">${address}</div>`,
          });
          markerRef.current.addListener("click", () => {
            infowindow.open(mapInstance.current!, markerRef.current!);
          });
        }

        // Callback with coordinates
        if (onLocationChange) {
          onLocationChange(lat, lng);
        }
      }
    },
    getCenter: () => {
      if (mapInstance.current) {
        const center = mapInstance.current.getCenter();
        if (center) {
          return { lat: center.lat(), lng: center.lng() };
        }
      }
      return { lat: 12.9716, lng: 77.5946 };
    }
  }));

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      // Initialize Google Map
      mapInstance.current = new google.maps.Map(mapContainer.current, {
        center: { lat: 12.9716, lng: 77.5946 }, // Bangalore
        zoom: 12,
      });

      // Initial marker
      markerRef.current = new google.maps.Marker({
        position: { lat: 12.9716, lng: 77.5946 },
        map: mapInstance.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#0d9488",
          fillOpacity: 1,
          strokeWeight: 1,
        },
      });

      // Map click event to update location
      mapInstance.current.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();

          // Update marker position
          if (markerRef.current) {
            markerRef.current.setPosition({ lat, lng });
          }

          // Callback with coordinates
          if (onLocationChange) {
            onLocationChange(lat, lng);
          }
        }
      });
    }

    return () => {
      if (mapInstance.current) {
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        mapInstance.current = null;
        markerRef.current = null;
      }
    };
  }, [onLocationChange]);

  return <div ref={mapContainer} className="h-[635px] w-full rounded-xl shadow" />;
});

VectorMap.displayName = 'VectorMap';

export default VectorMap;
