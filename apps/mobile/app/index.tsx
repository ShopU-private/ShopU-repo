import React from 'react';
import { useAuth } from '@/context/authContext';
import { Redirect } from 'expo-router';

const AppIndex = () => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) {
    return null;
  }

  if (isLoggedIn) {
    return <Redirect href={'/(root)/(tabs)/home'} />;
  } else {
    return <Redirect href={'/(auth)/welcome'} />;
  }
};

export default AppIndex;
