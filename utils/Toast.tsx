'use client'

import { Toaster } from "react-hot-toast";

function Toast() {
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      gutter={12}
      containerClassName="!mt-5"
      toastOptions={{
        duration: 4000,
        className: 'backdrop-blur-sm',
        style: {
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#1a1a1a',
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          fontWeight: '500',
          maxWidth: '420px',
          backdropFilter: 'blur(10px)',
        },
        success: {
          duration: 3500,
          className: 'toast-success',
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#fff',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4), 0 8px 10px -6px rgba(16, 185, 129, 0.3)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        },
        error: {
          duration: 4500,
          className: 'toast-error',
          style: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#fff',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4), 0 8px 10px -6px rgba(239, 68, 68, 0.3)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        },
        loading: {
          className: 'toast-loading',
          style: {
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: '#fff',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 8px 10px -6px rgba(59, 130, 246, 0.3)',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#3b82f6',
          },
        },
      }}
    />
  );
}

export default Toast;
