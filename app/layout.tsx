// import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';
// import './globals.css';
// import { LocationProvider } from './context/LocationContext';
// import { CartModalProvider } from './context/CartModalContext';
// import CartModalWrapper from './components/CartModalWrapper';

// import Script from 'next/script';

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

// export const metadata: Metadata = {
//   title: 'ShopU',
//   description: 'Your one-stop shop for all your needs',
//   icons: {
//     icon: '/Shop U Logo-02.jpg',
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
//         <LocationProvider>
//           <CartModalProvider>
//             {children}
//             <CartModalWrapper />
//           </CartModalProvider>
//         </LocationProvider>
//         <Script
//           id="razorpay-checkout-js"
//           src="https://checkout.razorpay.com/v1/checkout.js"
//           strategy="beforeInteractive"
//         />
//       </body>
//     </html>
//   );
// }
import type { Metadata } from 'next';
import { Karla } from 'next/font/google';
import './globals.css';
import { LocationProvider } from './context/LocationContext';
import { CartModalProvider } from './context/CartModalContext';
import CartModalWrapper from './components/CartModalWrapper';
import Header from './components/Header';
import Footer from './components/Footer';
import Script from 'next/script';

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
            <Header />
            <main className="bg-background min-h-[calc(100vh-200px)]">{children}</main>
            <Footer />
            <CartModalWrapper />
          </CartModalProvider>
        </LocationProvider>
        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
