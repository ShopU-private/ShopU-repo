"use client";
import { useState } from 'react';
import { X, Phone, Lock } from 'lucide-react';
import Image from 'next/image';
import Logo from "../../public/Shop U Logo-02.jpg";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    try {
      const response = await fetch('/api/auth/login/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (data.sent) {
        setShowOtpInput(true);
        setError('');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch('/api/auth/login/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });

      const data = await response.json();

      if (data.success) {
        onClose();
        window.location.reload();
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative shadow-2xl transform transition-all animate-slideUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-8">
          <div className="flex flex-col items-center justify-center">
            <Image
              src={Logo}
              alt="ShopU Logo"
              className="h-28 w-auto mb-2"
              width={200}
              height={112}
            />
            <p className="text-gray-600 text-lg">
              Please login to continue shopping
            </p>
          </div>
        </div>

        {!showOtpInput ? (
          <div className="space-y-6">
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            <div className="relative">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-500">
                  <Phone className="w-5 h-5" />
                </span>
                <span className="absolute left-12 text-gray-500">+91</span>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-24 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-xl hover:bg-teal-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-lg shadow-teal-200"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            <div className="relative">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  placeholder="Enter OTP"
                />
              </div>
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-xl hover:bg-teal-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium shadow-lg shadow-teal-200"
            >
              Verify OTP
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 