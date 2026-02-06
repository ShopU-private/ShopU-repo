'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function DevelopmentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const bannerDismissed = localStorage.getItem('devBannerDismissed');
    setIsVisible(!bannerDismissed);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('devBannerDismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close banner"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <span className="text-3xl">🚧</span>
          </div>

          <h2 className="mb-2 text-xl font-bold text-gray-800">
            Website Under Development
          </h2>

          <p className="mb-6 text-sm text-gray-600">
            Our website is currently being built. For the best experience, download our app from the Play Store!
          </p>

          <Link
            href="https://play.google.com/store/apps/details?id=shopu.com.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
            </svg>
            Download ShopU App
          </Link>

          <button
            onClick={handleClose}
            className="mt-4 block w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Continue to website anyway
          </button>
        </div>
      </div>
    </div>
  );
}
