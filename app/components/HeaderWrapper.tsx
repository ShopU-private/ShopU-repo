'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function HeaderWrapper() {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <>
      {!isAdminRoute && (
        <div className="hidden md:block">
          <Header />
        </div>
      )}

      {pathname === '/' && !isAdminRoute && (
        <div className="block md:hidden">
          <Header />
        </div>
      )}
    </>
  );
}
