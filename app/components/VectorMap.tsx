'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function OlaVectorMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

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

      new maplibregl.Marker()
        .setLngLat([77.5946, 12.9716])
        .addTo(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        try {
          mapInstance.current.remove();
        } catch (e) {
          console.warn('Map already removed:', e);
        } finally {
          mapInstance.current = null;
        }
      }
    };
  }, []);

  return <div ref={mapContainer} className="h-[635px] w-full rounded-xl shadow" />;
}
