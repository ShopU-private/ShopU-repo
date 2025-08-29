'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface MapRef {
  updateLocation: (lat: number, lng: number, address?: string) => void;
  getCenter: () => { lat: number; lng: number };
}

interface VectorMapProps {
  onLocationChange?: (lat: number, lng: number) => void;
}

const VectorMap = forwardRef<MapRef, VectorMapProps>(({ onLocationChange }, ref) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useImperativeHandle(ref, () => ({
    updateLocation: (lat: number, lng: number, address?: string) => {
      if (mapInstance.current) {
        // Update map center
        mapInstance.current.flyTo({
          center: [lng, lat],
          zoom: 15,
          duration: 1000
        });

        // Remove existing marker
        if (markerRef.current) {
          markerRef.current.remove();
        }

        // Add new marker
        markerRef.current = new maplibregl.Marker({ color: '#0d9488' })
          .setLngLat([lng, lat])
          .addTo(mapInstance.current);

        // Add popup with address if provided
        if (address) {
          const popup = new maplibregl.Popup({ offset: 25 })
            .setHTML(`<div class="p-2 text-sm">${address}</div>`);
          
          markerRef.current.setPopup(popup);
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
        return { lat: center.lat, lng: center.lng };
      }
      return { lat: 12.9716, lng: 77.5946 };
    }
  }));

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json`,
        center: [77.5946, 12.9716], // Bangalore
        zoom: 12,
        transformRequest: url => {
          if (url.includes('api.olamaps.io')) {
            const separator = url.includes('?') ? '&' : '?';
            return {
              url: `${url}${separator}api_key=${process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY}`,
            };
          }
          return { url };
        },
      });

      // Initial marker
      markerRef.current = new maplibregl.Marker({ color: '#0d9488' })
        .setLngLat([77.5946, 12.9716])
        .addTo(mapInstance.current);

      // Map click event to update location
      mapInstance.current.on('click', (e) => {
        const { lat, lng } = e.lngLat;
        
        // Update marker position
        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        }
        
        // Callback with coordinates
        if (onLocationChange) {
          onLocationChange(lat, lng);
        }
      });
    }

    return () => {
      if (mapInstance.current) {
        try {
          if (markerRef.current) {
            markerRef.current.remove();
          }
          mapInstance.current.remove();
        } catch (e) {
          console.warn('Map already removed:', e);
        } finally {
          mapInstance.current = null;
          markerRef.current = null;
        }
      }
    };
  }, [onLocationChange]);

  return <div ref={mapContainer} className="h-[635px] w-full rounded-xl shadow" />;
});

VectorMap.displayName = 'VectorMap';

export default VectorMap;