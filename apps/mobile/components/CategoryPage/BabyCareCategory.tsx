import { images } from '@/constants';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const babyCareCategory = [
  {
    image: images.babyCareImage1,
    title: 'Diapering',
  },
  {
    image: images.babyCareImage2,
    title: 'Diaper by Weight',
  },
  {
    image: images.babyCareImage3,
    title: 'Baby Food',
  },
  {
    image: images.babyCareImage4,
    title: 'Baby Skin Care',
  },
  {
    image: images.babyCareImage5,
    title: 'Baby Food by Age',
  },
  {
    image: images.babyCareImage6,
    title: 'Baby Hare Care',
  },
  {
    image: images.babyCareImage7,
    title: 'Baby Bath',
  },
  {
    image: images.babyCareImage8,
    title: 'Baby Oral Care',
  },
  {
    image: images.babyCareImage9,
    title: 'Feeding Bottles & Accessories',
  },
  {
    image: images.babyCareImage10,
    title: 'Breast Feeding',
  },
  {
    image: images.babyCareImage11,
    title: 'Mother care',
  },
  {
    image: images.babyCareImage12,
    title: 'Baby Health & Safety',
  },
];

const BabyCareCategory = () => {
  return (
    <View className="m-auto mt-4 w-[95%]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="font-RobotoMedium text-primary-bold ml-3 text-[20px]">Baby Care</Text>
        <View className="mt-4 flex flex-row flex-wrap">
          {babyCareCategory &&
            babyCareCategory.map((item, index) => (
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

export default BabyCareCategory;
