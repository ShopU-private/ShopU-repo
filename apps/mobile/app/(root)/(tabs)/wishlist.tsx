import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import { Trash2 } from 'lucide-react-native';
import { images } from '@/constants';

const sampleData = [
  {
    id: '1',
    name: 'Nivea Multi-Purpose Creme Protects & ....',
    subtitle: '100 gm Powder',
    price: 130,
    mrp: 165,
    discount: 27,
    image: images.babyCareImage2,
  },
  {
    id: '2',
    name: 'Sugar Free Gold Low Calorie Aspartame Sw..',
    subtitle: '100 gm Powder',
    price: 170,
    mrp: 195,
    discount: 15,
    image: images.orsImage,
  },
  {
    id: '3',
    name: 'Nivea Lemon & Oil Shower Care Oil Pearls...',
    subtitle: '100 gm Powder',
    price: 230,
    mrp: 246,
    discount: 10,
    image: images.babyCareImage3,
  },
  {
    id: '4',
    name: 'Nivea Lemon & Oil Shower Care Oil Pearls...',
    subtitle: '100 gm Powder',
    price: 230,
    mrp: 246,
    discount: 10,
    image: images.babyCareImage4,
  },
  {
    id: '5',
    name: 'Nivea Lemon & Oil Shower Care Oil Pearls...',
    subtitle: '100 gm Powder',
    price: 230,
    mrp: 246,
    discount: 10,
    image: images.babyCareImage5,
  },
  {
    id: '6',
    name: 'Nivea Lemon & Oil Shower Care Oil Pearls...',
    subtitle: '100 gm Powder',
    price: 230,
    mrp: 246,
    discount: 15,
    image: images.babyCareImage6,
  },
];

const WishList = () => {
  const renderItem = ({ item }: { item: any }) => (
    <View className="mx-3 my-1.5 flex-row items-center rounded-xl border border-gray bg-white p-2 shadow-md">
      <View className="p-2">
        <Image source={item.image} className="h-24 w-24" resizeMode="contain" />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-md font-RobotoRegular" numberOfLines={2}>
          {item.name}
        </Text>
        <Text className="my-1 font-RobotoRegular text-[11px] text-[#666666]">{item.subtitle}</Text>
        <View className="flex-row items-center">
          <Text className="text-xl font-medium text-[#317C80]">₹{item.price}</Text>
          <Text className="ml-2 font-RobotoRegular text-[11px] text-[#666666] line-through">
            MRP ₹{item.mrp}
          </Text>
          <Text className="ml-2 text-xs text-green-600">{item.discount}% OFF</Text>
        </View>
      </View>

      <View className="items-end p-4 ">
        <TouchableOpacity className="mb-6">
          <Trash2 size={22} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity className="rounded-lg bg-[#317C80] px-6 py-1.5">
          <Text className="text-sm font-semibold text-white">Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={sampleData}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingVertical: 10 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default WishList;
