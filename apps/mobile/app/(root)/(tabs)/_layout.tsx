import { HomeHeader } from '@/components/HomePage/HomeHeader';
import { images } from '@/constants';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';

const TabsLayout = () => {
  const router = useRouter();
  const handleCategoryBack = () => {
    router.back();
  };

  const CategoryHeaderLeft = () => (
    <TouchableOpacity onPress={handleCategoryBack}>
      <View className="ml-5">
        <FeatherIcon name="arrow-left" color={'white'} size={24} />
      </View>
    </TouchableOpacity>
  );

  const CategoryHeaderRight = () => (
    <View className="mr-6 flex flex-row items-center gap-7">
      <TouchableOpacity>
        <IoniconsIcon name="search" color={'white'} size={24} />
      </TouchableOpacity>
      <TouchableOpacity>
        <Image source={images.cartIcon} className="h-6 w-6" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarLabelStyle: {
          textTransform: 'capitalize',
          fontSize: 10,
          fontWeight: 'semibold',
          padding: 2,
        },
        tabBarStyle: {
          height: 95,
        },
        tabBarItemStyle: {
          alignItems: 'center',
          alignContent: 'center',
        },
        tabBarActiveTintColor: '#317C80',
        tabBarInactiveTintColor: '#66666666',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerStyle: {
            backgroundColor: '#317C80',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerStatusBarHeight: 90,
          headerTitle: () => <HomeHeader />,
          headerTintColor: 'white',
          headerTransparent: false,
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                source={focused ? images.homeTabActiveIcon : images.homeTabIcon}
                style={{ height: 24, width: 24, resizeMode: 'contain' }}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          headerTintColor: 'white',
          headerLeft: () => <CategoryHeaderLeft />,
          headerRight: () => <CategoryHeaderRight />,
          headerTitleStyle: {
            textTransform: 'capitalize',
            padding: 10,
          },
          headerStyle: {
            backgroundColor: '#317C80',
          },
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                source={focused ? images.categoryTabActiveIcon : images.categoryTabInactiveIcon}
                style={{ height: 24, width: 24, resizeMode: 'contain' }}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          headerTintColor: 'white',
          headerLeft: () => <CategoryHeaderLeft />,
          headerRight: () => <CategoryHeaderRight />,
          headerTitleStyle: {
            textTransform: 'capitalize',
            padding: 10,
          },
          headerStyle: {
            backgroundColor: '#317C80',
          },
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                source={focused ? images.orderTabActiveIcon : images.orderTabInactiveIcon}
                style={{ height: 24, width: 24, resizeMode: 'contain' }}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          headerTintColor: 'white',
          headerLeft: () => <CategoryHeaderLeft />,
          headerRight: () => <CategoryHeaderRight />,
          headerTitleStyle: {
            textTransform: 'capitalize',
            padding: 10,
          },
          headerStyle: {
            backgroundColor: '#317C80',
          },
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                source={focused ? images.wishListTabActiveIcon : images.wishListTabInactiveIcon}
                style={{ height: 24, width: 24, resizeMode: 'contain' }}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          headerTintColor: 'white',
          headerRight: () => <CategoryHeaderRight />,
          headerTitleStyle: {
            textTransform: 'capitalize',
            padding: 10,
          },
          headerStyle: {
            backgroundColor: '#317C80',
          },
          tabBarIcon: ({ focused }) => {
            return (
              <Image
                source={focused ? images.accountTabActiveIcon : images.accountTabInactiveIcon}
                style={{ height: 24, width: 24, resizeMode: 'contain' }}
              />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
