'use client';

import { useAppDispatch } from '@/store/redux/hook';
import { verifyOtp } from '@/store/slices/authSlice';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';


export default function OtpModal({
  phone,
  visible,
  onClose,
}: {
  phone: string;
  visible: boolean;
  onClose: () => void;
}) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const dispatch = useAppDispatch();

  // Reset OTP when modal opens
  useEffect(() => {
    if (visible) {
      setOtp(['', '', '', '', '', '']);
      inputsRef.current = [];
      setTimeout(() => inputsRef.current[0]?.focus(), 0);
    }
  }, [visible]);

  // Handle digit typing
  const handleChange = (val: string, i: number) => {
    if (!/^[0-9]?$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);

    if (val && i < 5) inputsRef.current[i + 1]?.focus();
  };

  // Backspace focus control
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  // Verify OTP Using Redux Thunk
  const handleVerify = async () => {
    const fullOtp = otp.join('');

    if (fullOtp.length !== 6) {
      toast.error('Enter all 6 digits');
      return;
    }

    try {
      // Dispatch Redux Thunk
      const res = await dispatch(
        verifyOtp({
          phoneNumber: phone,
          otp: fullOtp,
        })
      ).unwrap();

      // Success handled already in toast.promise
      if (res.success) {
        onClose();

      }
    } catch (error) {
      // Error toast already handled in thunk
      console.log("OTP Verify Failed:", error);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[90%] max-w-md rounded-lg bg-white p-6 text-center shadow-md">

        <h2 className="mb-2 text-xl font-semibold">
          OTP Verification
        </h2>

        <p className="mb-4 text-sm text-gray-600">
          Enter the 6-digit code sent to {phone}
        </p>

        {/* OTP Inputs */}
        <div className="mb-4 flex justify-center gap-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="h-12 w-10 rounded border text-center text-lg"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Verify OTP
        </button>

        {/* Resend */}
        <p
          className="mt-3 cursor-pointer text-sm text-blue-500"
          onClick={() => toast("Resend OTP coming soon")}
        >
          Resend OTP
        </p>
      </div>
    </div>
  );
}
