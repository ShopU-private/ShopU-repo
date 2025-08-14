import type { Metadata } from 'next';
import { Karla } from 'next/font/google';
import './globals.css';
import { LocationProvider } from './context/LocationContext';
import { CartModalProvider } from './context/CartModalContext';
import CartModalWrapper from './components/CartModalWrapper';
import Footer from './components/Footer';
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';
import HeaderWrapper from './components/HeaderWrapper';

const karla = Karla({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ShopU',
  description: 'Your one-stop shop for all your needs',
  icons: {
    icon: '/Shop U Logo-02.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${karla.className} antialiased`}>
        <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
        <LocationProvider>
          <CartModalProvider>
            <HeaderWrapper />
            <main className="bg-background min-h-[calc(100vh-200px)]">{children}</main>
            <Footer />
            <CartModalWrapper />
          </CartModalProvider>
        </LocationProvider>

        {/* Razorpay */}
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />

        {/* Google Maps Places API */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
