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
      <div className="bg-gray-200 text-center py-10 px-6 sm:px-10 lg:px-20">
        <h2 className="text-xl font-semibold">Join our newsletter and get</h2>
        <p className="text-sm text-gray-600 mt-1">
          Join our email subscription now to get updates on promotions and coupons.
        </p>
        <form className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-2 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Your Email Address"
            className="w-full sm:flex-1 px-4 py-3 rounded-full bg-gray-800 text-white placeholder-gray-300 border-none focus:outline-none text-center sm:text-left"
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Footer Grid */}
      <div className="border-t py-10 px-6 sm:px-10 lg:px-20 grid gap-10 sm:grid-cols-2 md:grid-cols-4 text-sm text-center sm:text-left">
        {/* ShopU Logo */}
        <div className="flex flex-col items-center sm:items-start">
          <img
            src="/logoGreen.png" // make sure it's a transparent PNG
            alt="Shopu Logo"
            className="w-20 sm:w-24 md:w-28 h-auto object-contain"
          />
          <div className="mt-4 space-y-2 text-gray-700 text-sm">
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <Phone size={16} /> 1233-777
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <Mail size={16} /> shopU@contact.com
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <MapPin size={16} /> Boring Road, Patna
            </p>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <ul className="space-y-2 text-gray-600">
            <li>Baby Care</li>
            <li>Women Care</li>
            <li>Personal Care</li>
            <li>Ayurveda</li>
          </ul>
        </div>

        {/* Health Concern */}
        <div>
          <h3 className="font-semibold mb-3">Health Concern</h3>
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
          <h3 className="font-semibold mb-3">Account</h3>
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
      <div className="border-t py-6 px-6 sm:px-10 lg:px-20 flex flex-col sm:flex-row sm:justify-between items-center gap-4 text-sm text-gray-500">
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
          <FaFacebookF className="hover:text-gray-800 cursor-pointer" />
          <FaLinkedinIn className="hover:text-gray-800 cursor-pointer" />
          <FaInstagram className="hover:text-gray-800 cursor-pointer" />
          <FaTwitter className="hover:text-gray-800 cursor-pointer" />
        </div>
      </div>
    </footer>
  );
}
