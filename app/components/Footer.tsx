"use client";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-800">
      {/* Newsletter Section */}
      <div className="bg-gray-200 px-6 py-10 text-center sm:px-10 lg:px-20">
        <h2 className="text-xl font-semibold">Join our newsletter and get</h2>
        <p className="mt-1 text-sm text-gray-600">
          Join our email subscription now to get updates on promotions and coupons.
        </p>
        <form className="mx-auto mt-6 flex max-w-lg flex-col items-center justify-center gap-2 sm:flex-row">
          <input
            type="email"
            placeholder="Your Email Address"
            className="w-full rounded-full border-none bg-gray-800 px-4 py-3 text-center text-white placeholder-gray-300 focus:outline-none sm:flex-1 sm:text-left"
          />
          <button
            type="submit"
            className="rounded-full bg-gray-800 px-6 py-3 text-white hover:bg-gray-700"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Footer Grid */}
      <div className="grid gap-10 border-t px-6 py-10 text-center text-sm sm:grid-cols-2 sm:px-10 sm:text-left md:grid-cols-4 lg:px-20">
        {/* ShopU Logo */}
        <div className="flex flex-col items-center sm:items-start">
          <img
            src="/logoGreen.png" // make sure it's a transparent PNG
            alt="Shopu Logo"
            className="h-auto w-20 object-contain sm:w-24 md:w-28"
          />
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <p className="flex items-center justify-center gap-2 sm:justify-start">
              <Phone size={16} /> 1233-777
            </p>
            <p className="flex items-center justify-center gap-2 sm:justify-start">
              <Mail size={16} /> shopU@contact.com
            </p>
            <p className="flex items-center justify-center gap-2 sm:justify-start">
              <MapPin size={16} /> Boring Road, Patna
            </p>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="mb-3 font-semibold">Categories</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Baby Care</li>
            <li>Women Care</li>
            <li>Personal Care</li>
            <li>Ayurveda</li>
          </ul>
        </div>

        {/* Health Concern */}
        <div>
          <h3 className="mb-3 font-semibold">Health Concern</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Diabetes Care</li>
            <li>Elderly Care</li>
            <li>Oral Care</li>
            <li>Stomach Care</li>
            <li>Liver Care</li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="mb-3 font-semibold">Account</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Wishlist</li>
            <li>
              <Link href="/cart">Cart</Link>
            </li>
            <li>Track Order</li>
            <li>Shipping Details</li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="flex flex-col items-center gap-4 border-t px-6 py-6 text-sm text-gray-500 sm:flex-row sm:justify-between sm:px-10 lg:px-20">
        <p>© 2025, All rights reserved</p>

        {/* Payment Icons */}
        <div className="flex gap-4">
          <img src="/visa.png" alt="Visa" className="h-6" />
          <img src="/mastercard.png" alt="MasterCard" className="h-6" />
          {/* Add PayPal back if needed: */}
          {/* <img src="/paypal.png" alt="Paypal" className="h-6" /> */}
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-gray-600">
          <FaFacebookF className="cursor-pointer hover:text-gray-800" />
          <FaLinkedinIn className="cursor-pointer hover:text-gray-800" />
          <FaInstagram className="cursor-pointer hover:text-gray-800" />
          <FaTwitter className="cursor-pointer hover:text-gray-800" />
        </div>
      </div>
    </footer>
  );
}
