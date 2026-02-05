import { View, Text, SafeAreaView, Image } from 'react-native';
import React from 'react';
import { images } from '@/constants';

const ReferAndEarn = () => {
  return (
    <SafeAreaView className="m-auto mb-4 mt-4 w-[95%]">
      <View className="flex flex-row items-center justify-around rounded-xl bg-primary-bold p-4">
        <View>
          <Text className="font-PoppinsSemiBold text-[20px] text-white">Refer and Earn $25</Text>
          <Text className="font-PoppinsRegular text-[12px] text-white">Your buddy get $10</Text>
        </View>
        <View>
          <Image source={images.referAndEarnImage} className="h-[80px] w-[80px]" />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ReferAndEarn;
