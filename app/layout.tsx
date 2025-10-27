import type { Metadata } from 'next';
import { Karla } from 'next/font/google';
import './globals.css';
import { LocationProvider } from './context/LocationContext';
import { CartModalProvider } from './context/CartModalContext';
import CartModalWrapper from './components/CartModalWrapper';
import Script from 'next/script';
import { HeaderWrapper, FooterWrapper } from './components/Wrapper';
import Toast from '@/utils/Toast';
import { NEXT_PUBLIC_GOOGLE_MAP_API_KEY } from '@/config';

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
        <LocationProvider>
          <CartModalProvider>
            <HeaderWrapper />
            <main className="bg-background min-h-[calc(100vh-200px)]">{children}</main>
            <FooterWrapper />
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
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&libraries=places`}
          async
          defer
        ></script>
        <Toast />
      </body>
    </html>
  );
}
