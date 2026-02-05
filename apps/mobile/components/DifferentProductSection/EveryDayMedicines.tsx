import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProductCardDesign from '../ProductCard/ProductCardDesign';
import { images } from '@/constants';

const everyDayMedicines = [
  {
    image: images.everydayMedicine1,
    title: 'Otrivin Oxy Fast Relief Adult Nasal Spray',
    volume: '10 ml Nasal Spray',
    mrp: 265,
    discount: '40% OFF',
    price: 195,
  },
  {
    image: images.everydayMedicine2,
    title: 'Moov Pain relief Ointement for back Pai.',
    volume: '650 ml tonic',
    mrp: 230,
    discount: '30% OFF',
    price: 187,
  },
  {
    image: images.everydayMedicine1,
    title: 'Otrivin Oxy Fast Relief Adult Nasal Spray',
    volume: '10 ml Nasal Spray',
    mrp: 265,
    discount: '40% OFF',
    price: 195,
  },
  {
    image: images.everydayMedicine2,
    title: 'Moov Pain relief Ointement for back Pai.',
    volume: '650 ml tonic',
    mrp: 230,
    discount: '30% OFF',
    price: 187,
  },
  {
    image: images.everydayMedicine1,
    title: 'Otrivin Oxy Fast Relief Adult Nasal Spray',
    volume: '10 ml Nasal Spray',
    mrp: 265,
    discount: '40% OFF',
    price: 195,
  },
  {
    image: images.everydayMedicine2,
    title: 'Moov Pain relief Ointement for back Pai.',
    volume: '650 ml tonic',
    mrp: 230,
    discount: '30% OFF',
    price: 187,
  },
  {
    image: images.everydayMedicine1,
    title: 'Otrivin Oxy Fast Relief Adult Nasal Spray',
    volume: '10 ml Nasal Spray',
    mrp: 265,
    discount: '40% OFF',
    price: 195,
  },
  {
    image: images.everydayMedicine2,
    title: 'Moov Pain relief Ointement for back Pai.',
    volume: '650 ml tonic',
    mrp: 230,
    discount: '30% OFF',
    price: 187,
  },
];

const EveryDayMedicines = () => {
  return (
    <View className="m-auto w-full px-2">
      <View className="mb-4 mt-6 flex flex-row items-center justify-between">
        <View>
          <Text className="font-KarlaBold text-lg">Everyday Medicines</Text>
        </View>
        <TouchableOpacity className="flex flex-row items-center gap-2">
          <Text className="font-KarlaRegular text-[14px] text-primary-bold">View All</Text>
          <Icon name="caret-right" size={20} color={'#317C80'} />
        </TouchableOpacity>
      </View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
        <View className="flex flex-row gap-4 py-1">
          {everyDayMedicines.map((products, index) => {
            return <ProductCardDesign key={index} product={products} />;
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default EveryDayMedicines;
