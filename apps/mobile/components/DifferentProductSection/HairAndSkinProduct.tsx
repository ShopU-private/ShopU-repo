import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProductCardDesign from '../ProductCard/ProductCardDesign';
import { images } from '@/constants';

const hairAndSkinSupplement = [
  {
    image: images.sugarFreeimage,
    title: 'Sugar Free Gold Low Calorie Aspartame Sw..',
    volume: '100 gm Powder',
    mrp: 165,
    discount: '50% OFF',
    price: 130,
  },
  {
    image: images.philipImage,
    title: 'Zandu Pancharishta Ayurveda Digestive',
    volume: '100 gm Powder',
    mrp: 175,
    discount: '50% OFF',
    price: 140,
  },
  {
    image: images.sugarFreeimage,
    title: 'Sugar Free Gold Low Calorie Aspartame Sw..',
    volume: '100 gm Powder',
    mrp: 165,
    discount: '50% OFF',
    price: 130,
  },
  {
    image: images.philipImage,
    title: 'Zandu Pancharishta Ayurveda Digestive',
    volume: '100 gm Powder',
    mrp: 175,
    discount: '50% OFF',
    price: 140,
  },
  {
    image: images.sugarFreeimage,
    title: 'Sugar Free Gold Low Calorie Aspartame Sw..',
    volume: '100 gm Powder',
    mrp: 165,
    discount: '50% OFF',
    price: 130,
  },
  {
    image: images.philipImage,
    title: 'Zandu Pancharishta Ayurveda Digestive',
    volume: '100 gm Powder',
    mrp: 175,
    discount: '50% OFF',
    price: 140,
  },
  {
    image: images.sugarFreeimage,
    title: 'Sugar Free Gold Low Calorie Aspartame Sw..',
    volume: '100 gm Powder',
    mrp: 165,
    discount: '50% OFF',
    price: 130,
  },
  {
    image: images.philipImage,
    title: 'Zandu Pancharishta Ayurveda Digestive',
    volume: '100 gm Powder',
    mrp: 175,
    discount: '50% OFF',
    price: 140,
  },
];

const HairAndSkinProducts = () => {
  return (
    <View className="m-auto w-full px-2">
      <View className="mb-4 mt-6 flex flex-row items-center justify-between">
        <View>
          <Text className="font-KarlaBold text-lg">Hair and Skin Supplement</Text>
        </View>
        <TouchableOpacity className="flex flex-row items-center gap-2">
          <Text className="font-KarlaRegular text-[14px] text-primary-bold">View All</Text>
          <Icon name="caret-right" size={20} color={'#317C80'} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <View className="flex flex-row gap-4 py-1">
          {hairAndSkinSupplement.map((products, index) => {
            return <ProductCardDesign key={index} product={products} />;
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default HairAndSkinProducts;
