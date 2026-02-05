import { images } from '@/constants';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useInsertionEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Image, Text, TextInput, View } from 'react-native';

const SearchBar = () => {
  const router = useRouter();
  const [showText, setShowText] = useState('Products');
  const slideAnimation = useRef(new Animated.Value(0)).current;

  useInsertionEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(slideAnimation, {
        toValue: -30,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowText(prev => (prev === 'Products' ? 'Medicine' : 'Products'));
        slideAnimation.setValue(30);
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [slideAnimation]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        router.back();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
    }, [router])
  );
  return (
    <View className="w-full px-4">
      <Image
        source={images.searchIcon}
        className="absolute left-[30px] top-[16px] z-50 h-[18px] w-[18px]"
      />
      <View className="relative w-full overflow-hidden">
        <TextInput
          className="w-full gap-2 overflow-hidden rounded-full bg-white px-14 py-5"
          autoFocus
          style={{
            shadowColor: 'gray',
            shadowOffset: {
              height: 0,
              width: 2,
            },
            shadowOpacity: 0.5,
            shadowRadius: 5,
            elevation: 10,
          }}
        />
        <View className="absolute left-14 top-5">
          <Text>Search</Text>
        </View>
        <Animated.Text
          className={'absolute left-[95px] top-5'}
          style={{
            transform: [{ translateY: slideAnimation }],
          }}
        >
          &quot;{showText}&quot;
        </Animated.Text>
      </View>
    </View>
  );
};

export default SearchBar;
