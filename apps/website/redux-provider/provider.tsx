'use client';

import { Provider } from 'react-redux';
import { store } from '@shopu/redux-toolkit/store';
import React, { useEffect } from 'react';
import { checkAuthStatus } from '@shopu/redux-toolkit/authSlice';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check authentication status when the app loads
    store.dispatch(checkAuthStatus());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
