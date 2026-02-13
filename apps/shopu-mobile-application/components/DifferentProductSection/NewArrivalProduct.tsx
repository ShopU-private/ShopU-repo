import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProductCardDesign from '../ProductCard/ProductCardDesign';
import { images } from '@/constants';

const newArrivalProduct = [
  {
    image: images.orsImage,
    title: 'Prolyte ORS Ready to drink for body flui..',
    volume: '200 ml liquid',
    mrp: 255,
    discount: '50% OFF',
    price: 210,
  },
  {
    image: images.moveImage,
    title: 'Moov Pain relief Ointement for back Pai.',
    volume: '100 gm Cream',
    mrp: 165,
    discount: '50% OFF',
    price: 130,
  },
  {
    image: images.orsImage,
    title: 'Prolyte ORS Ready to drink for body flui..',
    volume: '200 ml liquid',
    mrp: 255,
    discount: '50% OFF',
    price: 210,
  },
  {
    image: images.moveImage,
    title: 'Moov Pain relief Ointement for back Pai.',
    volume: '100 gm Cream',
    mrp: 165,
    discount: '50% OFF',
    price: 130,
  },
  {
    image: images.orsImage,
    title: 'Prolyte ORS Ready to drink for body flui..',
    volume: '200 ml liquid',
    mrp: 255,
    discount: '50% OFF',
    price: 210,
  },
  {
    image: images.moveImage,
    title: 'Moov Pain relief Ointement for back Pai.',
    volume: '100 gm Cream',
    mrp: 165,
    discount: '50% OFF',
    price: 130,
  },
  {
    image: images.orsImage,
    title: 'Prolyte ORS Ready to drink for body flui..',
    volume: '200 ml liquid',
    mrp: 255,
    discount: '50% OFF',
    price: 210,
  },
  {
    image: images.moveImage,
    title: 'Moov Pain relief Ointement for back Pai.',
    volume: '100 gm Cream',
    mrp: 165,
    discount: '50% OFF',
    price: 130,
  },
];

const NewArrivalProduct = () => {
  return (
    <View className="m-auto w-full px-2">
      <View className="mb-4 mt-6 flex flex-row items-center justify-between">
        <View>
          <Text className="font-KarlaBold text-lg">New Arrival</Text>
        </View>
        <TouchableOpacity className="flex flex-row items-center gap-2">
          <Text className="font-KarlaRegular text-primary-bold text-[14px]">View All</Text>
          <Icon name="caret-right" size={20} color={'#317C80'} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <View className="flex flex-row gap-4 py-1">
          {newArrivalProduct.map((products, index) => {
            return <ProductCardDesign key={index} product={products} />;
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default NewArrivalProduct;
