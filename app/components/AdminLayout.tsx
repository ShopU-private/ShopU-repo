'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  PackageOpen, 
  Users, 
  ShoppingBag, 
  FileBarChart,
  Menu, 
  X,
  Home
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/account/me', {
          method: 'GET',
          credentials: 'include', // Ensures cookies are sent with the request
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!res.ok) {
          throw new Error('Authentication failed');
        }
        
        const data = await res.json();
        console.log('Auth data:', data.role);

        if (data.role === 'ADMIN' || data.role === 'admin') {
          setIsAuthenticated(true);
        } else {
          console.log('Not an admin user:', data.role);
          router.push(`/login?returnUrl=${encodeURIComponent('/admin')}`);
          //  router.push(`/admin`);
        }
      } catch (error) {
        console.error('Auth check failed', error);
        router.push(`/login?returnUrl=${encodeURIComponent('/admin')}`);
          // router.push(`/admin`);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: <Home className="w-5 h-5" />,
      active: pathname === '/admin'
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: <PackageOpen className="w-5 h-5" />,
      active: pathname.startsWith('/admin/orders')
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: <ShoppingBag className="w-5 h-5" />,
      active: pathname.startsWith('/admin/products')
    },
    {
      name: 'Customers',
      href: '/admin/customers',
      icon: <Users className="w-5 h-5" />,
      active: pathname.startsWith('/admin/customers')
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: <FileBarChart className="w-5 h-5" />,
      active: pathname.startsWith('/admin/reports')
    }
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-t-teal-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-40 w-full bg-white shadow-sm p-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-white shadow-md">
        <div className="px-4 py-5 flex items-center justify-center border-b border-gray-200">
          <h1 className="text-xl font-bold text-teal-700">Admin Dashboard</h1>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigationItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                item.active 
                  ? 'bg-teal-100 text-teal-900' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="px-4 py-4 border-t border-gray-200">
          <Link 
            href="/"
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
          >
            <Home className="mr-3 w-5 h-5" />
            Back to Shop
          </Link>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="relative flex flex-col w-full max-w-xs bg-white h-full">
            <div className="px-4 py-5 flex items-center justify-between border-b border-gray-200">
              <h1 className="text-xl font-bold text-teal-700">Admin Dashboard</h1>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigationItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    item.active 
                      ? 'bg-teal-100 text-teal-900' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="px-4 py-4 border-t border-gray-200">
              <Link 
                href="/"
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="mr-3 w-5 h-5" />
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto pt-16 lg:pt-0 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
