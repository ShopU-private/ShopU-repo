'use client';
import { useState } from 'react';
import { X, Phone, Lock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Logo from '../../public/Shop U Logo-02.jpg';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhoneChange?: (phone: string) => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError('Enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (data.success || data.sent) {
        toast.success('OTP sent successfully!');
        setShowOtpInput(true);
        setError('');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Enter the full 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

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
        toast.success('Login successful!');
        onClose();
        router.push('/'); // redirect to home
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="animate-slideUp relative w-full max-w-md transform rounded-2xl bg-white p-8 shadow-2xl transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-8 flex flex-col items-center justify-center">
          <Image
            src={Logo}
            alt="ShopU Logo"
            className="mb-2 h-28 w-auto"
            width={200}
            height={112}
          />
          <p className="text-lg text-gray-600">Please login to continue shopping</p>
        </div>

        {!showOtpInput ? (
          <div className="space-y-6">
            {error && <p className="text-center text-sm text-red-600">{error}</p>}
            <div className="relative">
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-gray-500">
                  <Phone className="h-5 w-5" />
                </span>
                <span className="absolute left-12 text-gray-500">+91</span>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-24 transition-all focus:border-transparent focus:ring-2 focus:ring-primaryColor focus:outline-none"
                  placeholder="Enter your phone number"
                  disabled={loading}
                />
              </div>
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full transform rounded-xl bg-background1 px-4 py-3 font-medium text-white shadow-lg shadow-teal-100 transition-all hover:scale-[1.02] hover:bg-background1 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {error && <p className="text-center text-sm text-secondaryColor">{error}</p>}
            <div className="relative">
              <label htmlFor="otp" className="mb-2 block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-12 transition-all focus:border-transparent focus:ring-2 focus:ring-primaryColor focus:outline-none"
                  placeholder="Enter 6-digit OTP"
                  disabled={loading}
                />
              </div>
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full transform rounded-xl bg-background1 px-4 py-3 font-medium text-white shadow-lg shadow-teal-100 transition-all hover:scale-[1.02] hover:bg-background1 active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By continuing, you agree to our{' '}
            <a href="#" className="font-medium text-primaryColor hover:text-teal-700">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-primaryColor hover:text-teal-700">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
