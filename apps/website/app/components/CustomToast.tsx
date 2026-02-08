'use client';

import { Toaster, toast as hotToast } from 'react-hot-toast';
import { CheckCircle2, XCircle, Loader, Info, X } from 'lucide-react';

export const CustomToaster = () => {
  return (
    <Toaster
      position="top-right"
      containerStyle={{
        top: 80,
        right: 20,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'transparent',
          boxShadow: 'none',
          padding: 0,
          margin: 0,
        },
      }}
    >
      {t => (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            background: 'white',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
            maxWidth: '420px',
            minWidth: '300px',
            width: 'auto',
            borderLeft: `4px solid ${
              t.type === 'success'
                ? '#317c80'
                : t.type === 'error'
                  ? '#e93e40'
                  : t.type === 'loading'
                    ? '#6b7280'
                    : '#3b82f6'
            }`,
            animation: t.visible
              ? 'toastEnter 0.3s cubic-bezier(0.21, 1.02, 0.73, 1) forwards'
              : 'toastExit 0.2s ease-out forwards',
            pointerEvents: 'auto',
          }}
        >
          <style>{`
            @keyframes toastEnter {
              from {
                transform: translateX(100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }
            
            @keyframes toastExit {
              from {
                transform: translateX(0);
                opacity: 1;
              }
              to {
                transform: translateX(100%);
                opacity: 0;
              }
            }
            
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              flexShrink: 0,
              background:
                t.type === 'success'
                  ? '#317c80'
                  : t.type === 'error'
                    ? '#e93e40'
                    : t.type === 'loading'
                      ? '#6b7280'
                      : '#3b82f6',
            }}
          >
            {t.type === 'success' && (
              <CheckCircle2 style={{ width: '20px', height: '20px', color: 'white' }} />
            )}
            {t.type === 'error' && (
              <XCircle style={{ width: '20px', height: '20px', color: 'white' }} />
            )}
            {t.type === 'loading' && (
              <Loader
                style={{
                  width: '20px',
                  height: '20px',
                  color: 'white',
                  animation: 'spin 1s linear infinite',
                }}
              />
            )}
            {!t.type && <Info style={{ width: '20px', height: '20px', color: 'white' }} />}
          </div>

          <div style={{ flex: 1, minWidth: 0, paddingTop: '2px' }}>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                lineHeight: '1.5',
                color: '#1f2937',
                fontWeight: 500,
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              {typeof t.message === 'function' ? t.message(t) : t.message}
            </p>
          </div>

          <button
            onClick={() => hotToast.dismiss(t.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              flexShrink: 0,
              color: '#6b7280',
              transition: 'all 0.2s ease',
              padding: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.color = '#1f2937';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#6b7280';
            }}
            aria-label="Close notification"
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      )}
    </Toaster>
  );
};

// Custom toast functions with project colors
export const toast = {
  success: (message: string) => {
    return hotToast.success(message);
  },
  error: (message: string) => {
    return hotToast.error(message);
  },
  loading: (message: string) => {
    return hotToast.loading(message);
  },
  promise: <T,>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return hotToast.promise(promise, msgs);
  },
  custom: (message: string) => {
    return hotToast(message);
  },
  dismiss: (toastId?: string) => {
    return hotToast.dismiss(toastId);
  },
};

export default CustomToaster;
