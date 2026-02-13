import { AuthProvider } from '@/context/authContext';
import '@/global.css';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

const AppLayout = () => {
  const [loaded] = useFonts({
    'Karla-Regular': require('@/assets/fonts/Karla-Regular.ttf'),
    'Karla-SemiBold': require('@/assets/fonts/Karla-SemiBold.ttf'),
    'Karla-Medium': require('@/assets/fonts/Karla-Medium.ttf'),
    'Karla-Bold': require('@/assets/fonts/Karla-Bold.ttf'),
    'Roboto-Medium': require('@/assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Regular': require('@/assets/fonts/Roboto-Regular.ttf'),
    'Roboto-SemiBold': require('@/assets/fonts/Roboto-SemiBold.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'ios_from_left',
            animationDuration: 300,
            gestureEnabled: true,
          }}
        >
          <Stack.Screen name="index" />
        </Stack>
        <Toast />
      </AuthProvider>
    </>
  );
};

export default AppLayout;
