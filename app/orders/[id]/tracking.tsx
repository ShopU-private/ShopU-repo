'use client';

import { useState } from 'react';
import LiveTracking from '@/app/components/LiveTracking';
import { validateTrackingNumber } from '@/lib/checkout-utils';
import { Truck, ChevronDown, ChevronUp } from 'lucide-react';

interface TrackingProps {
  trackingNumber?: string | null;
}

export default function OrderTracking({ trackingNumber }: TrackingProps) {
  const [expanded, setExpanded] = useState(false);

  const isTrackingAvailable = validateTrackingNumber(trackingNumber);

  if (!isTrackingAvailable) {
    return (
      <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex items-center text-gray-500">
          <Truck className="h-5 w-5 mr-2" />
          <p>Tracking information will be available once your order ships.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 bg-teal-50 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <Truck className="h-5 w-5 text-teal-600 mr-2" />
          <div>
            <h3 className="font-medium">Package Tracking</h3>
            <p className="text-sm text-gray-600">AWB: {trackingNumber}</p>
          </div>
        </div>
        {expanded ? 
          <ChevronUp className="h-5 w-5 text-gray-400" /> :
          <ChevronDown className="h-5 w-5 text-gray-400" />
        }
      </div>
      
      {expanded && (
        <div className="p-4">
          <LiveTracking awb={trackingNumber!} />
        </div>
      )}
    </div>
  );
}
