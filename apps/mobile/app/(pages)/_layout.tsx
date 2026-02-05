import CustomSearchHeader from '@/components/SearchPage/CustomSearchHeader';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const PageLayout = () => {
  const router = useRouter();
  const handleBack = () => {
    router.push('/(root)/(tabs)/home');
  };
  return (
    <Stack
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity activeOpacity={0.7} className="mr-6" onPress={handleBack}>
            <Icon name="arrow-left" color={'white'} size={24} />
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="cart"
        options={{
          headerStyle: {
            backgroundColor: '#317C80',
          },
          headerTintColor: 'white',
          headerTitle: 'Cart',
        }}
      />
      <Stack.Screen
        name="notification"
        options={{
          headerStyle: {
            backgroundColor: '#317C80',
          },
          headerTintColor: 'white',
          headerTitle: 'Notification',
        }}
      />
      <Stack.Screen
        name="searchPage"
        options={{
          header: () => <CustomSearchHeader />,
          animation: 'ios_from_right',
          animationDuration: 300,
          gestureEnabled: true,
          headerStyle: {
            backgroundColor: '#317C80',
          },
          headerLargeTitle: true,
        }}
      />
    </Stack>
  );
};

export default PageLayout;
