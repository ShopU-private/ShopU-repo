// components/OlaVectorMap.tsx
'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';

export default function OlaVectorMap() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      mapInstance.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `https://api.olamaps.io/tiles/vector/v1/styles/roadmap/style.json?api_key=${process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY}`,
        center: [77.5946, 12.9716], // [lon, lat] → Bangalore
        zoom: 12,
      });

      new maplibregl.Marker().setLngLat([77.5946, 12.9716]).addTo(mapInstance.current);
    }

    return () => {
      mapInstance.current?.remove();
    };
  }, []);

  return <div ref={mapContainer} className="h-[500px] w-full rounded-xl shadow" />;
}
