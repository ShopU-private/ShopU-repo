'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Phone } from 'lucide-react';
import Image from 'next/image';
import Logo from '../../public/Shop U Logo-03.jpg';
import { useAppDispatch } from '@shopu/redux-toolkit/hook';
import { verifyOtp } from '@shopu/redux-toolkit/authSlice';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhoneChange?: (phone: string) => void;
}

export default function LoginModal({ isOpen, onClose, onPhoneChange }: LoginModalProps) {
  const dispatch = useAppDispatch();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));

  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);

  const phoneInputRef = useRef<HTMLInputElement>(null);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setPhoneNumber('');
      setOtpDigits(Array(6).fill(''));
      setStep('PHONE');

      setError('');
      setLoading(false);
      setResendTimer(0);

      setTimeout(() => phoneInputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleSendOtp = async () => {
    if (phoneNumber.length !== 10) {
      setError('Enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await res.json();

      if (data.success || data.sent) {
        setStep('OTP');
        setResendTimer(30);

        setTimeout(() => otpRefs.current[0]?.focus(), 150);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch {
      setError('Something went wrong while sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = useCallback(async (fullOtp: string) => {
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const res = await dispatch(verifyOtp({ otp: fullOtp, phoneNumber })).unwrap();

      if (res.success) {
        // Clear OTP digits immediately after success
        setOtpDigits(Array(6).fill(''));
        setStep('PHONE'); // Reset step to prevent re-trigger
        onPhoneChange?.(phoneNumber);
        onClose();
      }
    } catch {
      setError('Invalid OTP, try again');
      setOtpDigits(Array(6).fill(''));
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }, [loading, dispatch, phoneNumber, onPhoneChange, onClose]);

  useEffect(() => {
    if (step !== 'OTP') return;

    const fullOtp = otpDigits.join('');

    if (fullOtp.length === 6 && !otpDigits.includes('')) {
      handleVerifyOtp(fullOtp);
    }
  }, [otpDigits, step, handleVerifyOtp, loading]);

  const handleOtpChange = (val: string, index: number) => {
    if (!/^[0-9]?$/.test(val)) return;

    const updated = [...otpDigits];
    updated[index] = val;
    setOtpDigits(updated);

    if (val && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text').slice(0, 6);

    if (!/^\d{6}$/.test(paste)) return;

    setOtpDigits(paste.split(''));
    otpRefs.current[5]?.focus();
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) handleSendOtp();
  };

  if (!isOpen) return null;

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="animate-slideUp relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <Image src={Logo} alt="ShopU Logo" width={200} height={100} />
          <p className="mt-3 text-lg text-gray-600">Please login to continue shopping</p>
        </div>

        {/* Error */}
        {error && <p className="mb-4 text-center text-sm text-red-600">{error}</p>}

        {step === 'PHONE' && (
          <div className="space-y-6">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>

            <div className="relative flex items-center">
              <Phone className="absolute left-3 h-5 w-5 text-gray-500" />
              <span className="absolute left-12 text-gray-500">+91</span>

              <input
                ref={phoneInputRef}
                type="tel"
                value={phoneNumber}
                maxLength={10}
                onChange={e => setPhoneNumber(e.target.value)}
                disabled={loading}
                placeholder="Enter phone number"
                className="focus:ring-primaryColor w-full rounded-xl border border-gray-300 py-3 pr-4 pl-24 focus:ring-2"
              />
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="bg-background1 hover:bg-background1 w-full rounded-xl px-4 py-3 font-medium text-white shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 'OTP' && (
          <div className="space-y-6">
            <p className="text-center text-gray-600">
              Enter OTP sent to <b>{phoneNumber}</b>
            </p>

            <div className="flex justify-center gap-2">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={el => {
                    otpRefs.current[index] = el;
                  }}
                  value={digit}
                  maxLength={1}
                  disabled={loading}
                  onPaste={handleOtpPaste}
                  onKeyDown={e => handleOtpKeyDown(e, index)}
                  onChange={e => handleOtpChange(e.target.value, index)}
                  className="focus:ring-primaryColor h-12 w-12 rounded-xl border border-gray-300 text-center text-xl font-semibold focus:ring-2 disabled:opacity-40"
                />
              ))}
            </div>

            {/* Verify */}
            <button
              onClick={() => handleVerifyOtp(otpDigits.join(''))}
              disabled={loading}
              className="bg-background1 hover:bg-background1 w-full rounded-xl px-4 py-3 font-medium text-white shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {/* Resend */}
            <div className="flex justify-end">
              <button
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
                className={`text-md px-4 ${resendTimer > 0
                  ? 'cursor-not-allowed text-gray-400'
                  : 'text-primaryColor cursor-pointer'
                  }`}
              >
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
