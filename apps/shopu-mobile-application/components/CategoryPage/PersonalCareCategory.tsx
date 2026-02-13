import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { images } from '@/constants';

const personalCareData = [
  {
    image: images.personalCareImage1,
    title: 'Skin Care',
  },
  {
    image: images.personalCareImage2,
    title: 'Hair Care',
  },
  {
    image: images.personalCareImage3,
    title: 'Men Grooming',
  },
  {
    image: images.personalCareImage4,
    title: 'Oral Care',
  },
  {
    image: images.personalCareImage5,
    title: 'Sexual Wellness',
  },
  {
    image: images.personalCareImage6,
    title: 'Fragrances',
  },
  {
    image: images.personalCareImage7,
    title: 'Adult Diaper',
  },
];

const PersonalCareCategory = () => {
  return (
    <View className="m-auto mt-4 w-[95%]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="font-RobotoMedium text-primary-bold ml-3 text-[20px]">Personal Care</Text>
        <View className="mt-4 flex flex-row flex-wrap">
          {personalCareData &&
            personalCareData.map((item, index) => (
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

export default PersonalCareCategory;
