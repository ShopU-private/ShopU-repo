"use client";
import { useState, useRef, useEffect } from "react";

export default function OtpModal({
  phone,
  visible,
  onClose,
}: {
  phone: string;
  visible: boolean;
  onClose: () => void;
}) {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
  if (visible) {
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current = [];
    setTimeout(() => inputsRef.current[0]?.focus(), 0);
  }
}, [visible]);


  const handleChange = (val: string, i: number) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (e: any, i: number) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) return alert("Enter all 6 digits");

    const res = await fetch("/api/auth/login/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phoneNumber: phone, otp: fullOtp }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Logged in successfully");
      onClose();
    } else {
      alert("Invalid OTP");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md text-center">
        <h2 className="text-xl font-semibold mb-2">OTP Verification</h2>
        <p className="text-sm text-gray-600 mb-4">Enter the 6-digit code sent to {phone}</p>
        <div className="flex justify-center gap-2 mb-4">
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
    className="w-10 h-12 border rounded text-center text-lg"
  />
))}

        </div>
        <button onClick={handleVerify} className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Verify
        </button>
        <div className="mt-2 text-sm text-blue-500 cursor-pointer" onClick={() => alert("Resent!")}>
          Resend
        </div>
      </div>
    </div>
  );
}
