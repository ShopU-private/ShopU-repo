import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { images } from '@/constants';

const womenCareCategory = [
  {
    image: images.womenCareImage1,
    title: 'Feminine Hygiene',
  },
  {
    image: images.womenCareImage2,
    title: 'Gyno Care',
  },
  {
    image: images.womenCareImage3,
    title: 'Women Supplements',
  },
  {
    image: images.womenCareImage4,
    title: 'Pregnancy',
  },
  {
    image: images.womenCareImage5,
    title: 'Grooming',
  },
];

const WomenCareCategory = () => {
  return (
    <View className="m-auto mt-4 w-[95%]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="font-RobotoMedium text-primary-bold ml-3 text-[20px]">Women Care</Text>
        <View className="mt-4 flex flex-row flex-wrap">
          {womenCareCategory &&
            womenCareCategory.map((item, index) => (
              <View key={index} className="mb-4 w-[25%] px-1">
                <TouchableOpacity activeOpacity={0.8} className="flex items-center gap-2">
                  <View className="border-gray rounded-3xl border bg-white p-5">
                    <Image source={item.image} className="h-[45px] w-[45px]" />
                  </View>
                  <Text className="text-center text-[12px]">{item.title}</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default WomenCareCategory;
