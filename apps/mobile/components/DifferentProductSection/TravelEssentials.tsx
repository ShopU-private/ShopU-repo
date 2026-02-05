import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProductCardDesign from '../ProductCard/ProductCardDesign';
import { images } from '@/constants';

const travelEssentials = [
  {
    image: images.travelEssentials1,
    title: 'Pampers Premium Care Diaper Pants XXL,',
    volume: '30 Count',
    mrp: 1260,
    discount: '40% OFF',
    price: 980,
  },
  {
    image: images.travelEssentials2,
    title: 'Himalaya Baby Diaper Rash Cream..',
    volume: '50gm',
    mrp: 230,
    discount: '30% OFF',
    price: 150,
  },
  {
    image: images.travelEssentials1,
    title: 'Pampers Premium Care Diaper Pants XXL,',
    volume: '30 Count',
    mrp: 1260,
    discount: '40% OFF',
    price: 980,
  },
  {
    image: images.travelEssentials2,
    title: 'Himalaya Baby Diaper Rash Cream..',
    volume: '50gm',
    mrp: 230,
    discount: '30% OFF',
    price: 150,
  },
  {
    image: images.travelEssentials1,
    title: 'Pampers Premium Care Diaper Pants XXL,',
    volume: '30 Count',
    mrp: 1260,
    discount: '40% OFF',
    price: 980,
  },
  {
    image: images.travelEssentials2,
    title: 'Himalaya Baby Diaper Rash Cream..',
    volume: '50gm',
    mrp: 230,
    discount: '30% OFF',
    price: 150,
  },
  {
    image: images.travelEssentials1,
    title: 'Pampers Premium Care Diaper Pants XXL,',
    volume: '30 Count',
    mrp: 1260,
    discount: '40% OFF',
    price: 980,
  },
  {
    image: images.travelEssentials2,
    title: 'Himalaya Baby Diaper Rash Cream..',
    volume: '50gm',
    mrp: 230,
    discount: '30% OFF',
    price: 150,
  },
];

const TravelEssentials = () => {
  return (
    <View className="m-auto w-full px-2">
      <View className="mb-4 mt-6 flex flex-row items-center justify-between">
        <View>
          <Text className="font-KarlaBold text-lg">Travel Essentials</Text>
        </View>
        <TouchableOpacity className="flex flex-row items-center gap-2">
          <Text className="font-KarlaRegular text-[14px] text-primary-bold">View All</Text>
          <Icon name="caret-right" size={20} color={'#317C80'} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <View className="flex flex-row gap-4 py-1">
          {travelEssentials.map((products, index) => {
            return <ProductCardDesign key={index} product={products} />;
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default TravelEssentials;
