import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { images } from '@/constants';

const healthCareData = [
  {
    image: images.healthCareImage1,
    title: 'BP Monitor',
  },
  {
    image: images.healthCareImage2,
    title: 'Glucometers & Test Strips',
  },
  {
    image: images.healthCareImage3,
    title: 'Covid Test Kit',
  },
  {
    image: images.healthCareImage4,
    title: 'Thermometers',
  },
  {
    image: images.healthCareImage5,
    title: 'Pulse Oximeter',
  },
  {
    image: images.healthCareImage6,
    title: 'Pregnancy Test Kit',
  },
  {
    image: images.healthCareImage7,
    title: 'Heating Belts',
  },
  {
    image: images.healthCareImage8,
    title: 'Weighing Machine',
  },
  {
    image: images.healthCareImage9,
    title: 'Nebulizer',
  },
  {
    image: images.healthCareImage10,
    title: 'Supports & Splints',
  },
  {
    image: images.healthCareImage11,
    title: 'Health Accessories',
  },
];

const HealthDeviceCategory = () => {
  return (
    <View className="m-auto mt-4 w-[95%]">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="font-RobotoMedium text-primary-bold ml-3 text-[20px]">Health Device</Text>
        <View className="mt-4 flex flex-row flex-wrap">
          {healthCareData &&
            healthCareData.map((item, index) => (
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

export default HealthDeviceCategory;
