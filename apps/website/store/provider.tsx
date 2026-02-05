'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import React, { useEffect } from 'react';
import { checkAuthStatus } from './slices/authSlice';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check authentication status when the app loads
    store.dispatch(checkAuthStatus());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
