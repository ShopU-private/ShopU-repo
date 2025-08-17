'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';

export default function Navroute() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract category from query params
  const categorySlug = searchParams.get('category');

  // Get path segments excluding UUIDs and empty strings
  const segments = pathname
    .split('/')
    .filter(
      seg =>
        seg &&
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(seg)
    );

  // Build path crumbs
  const crumbs = segments.map((seg, idx) => {
    const name = decodeURIComponent(seg)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    const href = '/' + segments.slice(0, idx + 1).join('/');
    return { name, href };
  });

  // Add Category Crumb if category param exists
  if (categorySlug) {
    crumbs.push({
      name: decodeURIComponent(categorySlug)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase()),
      href: pathname + '?category=' + encodeURIComponent(categorySlug),
    });
  }

  return (
    <nav className="bg-white text-sm text-gray-500">
      {/* Desktop View */}
      <div className="mx-auto hidden max-w-7xl p-4 md:block">
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
      <div className="md:hidden">
        <div className="bg-background1 flex items-center justify-between px-4 py-3">
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
