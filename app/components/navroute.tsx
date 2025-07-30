'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';

export default function Navroute() {
  const pathname = usePathname();
  const router = useRouter();
  // Get path segments (excluding empty string)
  // Get path segments excluding empty string and UUIDs
  const segments = pathname
    .split('/')
    .filter(
      seg =>
        seg &&
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(seg)
    );

  // Build cumulative routes for linking
  const crumbs = segments.map((seg, idx) => {
    const name = decodeURIComponent(seg)
      .replace(/_/g, ' ') // replace underscores with space
      .replace(/\b\w/g, l => l.toUpperCase()); // capitalize each word
    const href = '/' + segments.slice(0, idx + 1).join('/');
    return { name, href };
  });

  return (
    <nav className="bg-white text-sm text-gray-500">
      {/* Desktop View */}
      <div className="mx-auto hidden max-w-7xl p-4 sm:block">
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
        <div className="bg-background1 flex items-center justify-between p-4">
          <div>
            <button onClick={() => router.back()}>
              <ArrowLeft className="h-7 w-10 text-white" />
            </button>
          </div>
          <div className="flex">
            <Search className="h-6 w-14 text-white" />
            <ShoppingCart className="h-6 w-14 text-white" />
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
