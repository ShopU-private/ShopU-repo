'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';

export default function Navroute() {
  const pathname = usePathname();

  // Get path segments (excluding empty string)
  const segments = pathname.split('/').filter(seg => seg);

  // Build cumulative routes for linking
  const crumbs = segments.map((seg, idx) => {
    const href = '/' + segments.slice(0, idx + 1).join('/');
    return { name: decodeURIComponent(seg), href };
  });

  return (
    <nav className="bg-white text-sm text-gray-500">
      {/* Desktop View */}
      <div className="mx-auto hidden max-w-7xl px-4 py-5 sm:block">
        <ol className="flex items-center space-x-2 px-12">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>

          {crumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <li>/</li>
              <li>
                {idx === crumbs.length - 1 ? (
                  <span className="font-medium text-black capitalize">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className="capitalize hover:underline">
                    {crumb.name}
                  </Link>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden">
        <div className="bg-background1 flex justify-between px-4 py-4">
          <div className="">
            <ArrowLeft className="h-6 w-8 text-2xl text-white" />
          </div>
          <div className="flex">
            <Search className="h-6 w-12 text-white" />
            <ShoppingCart className="h-6 w-12 text-white" />
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-5">
          <ol className="flex items-center space-x-2 px-2">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            {crumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <li>/</li>
                <li>
                  {idx === crumbs.length - 1 ? (
                    <span className="font-medium text-black capitalize">{crumb.name}</span>
                  ) : (
                    <Link href={crumb.href} className="capitalize hover:underline">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  );
}
