import type { Metadata } from 'next';
import { Karla } from 'next/font/google';
import './globals.css';
import { LocationProvider } from './context/LocationContext';
import { CartModalProvider } from './context/CartModalContext';
import CartModalWrapper from './components/CartModalWrapper';
import Script from 'next/script';
import { HeaderWrapper, FooterWrapper } from './components/Wrapper';
import ReduxProvider from '@/redux-provider/provider';
import { envs } from '@shopu/config/config';
import CustomToaster from './components/CustomToast';

const karla = Karla({
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ShopU',
  description: 'Your one-stop shop for all your needs',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
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
        <ReduxProvider>
          <CustomToaster />
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
            src={`https://maps.googleapis.com/maps/api/js?key=${envs.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&libraries=places`}
            async
            defer
          ></script>
        </ReduxProvider>
      </body>
    </html>
  );
}
