import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { images } from '@/constants';

interface Order {
  id: string;
  title: string;
  info: string;
  date: string;
  orderId: string;
  price: string;
  status: 'RECEIVED' | 'CANCELLED';
  image: any;
}

const orders: Order[] = [
  {
    id: '1',
    title: 'Pampers Premium Care Diaper Pants XXL',
    info: '30 Count',
    date: '22 May 2025',
    orderId: '#ORD123423',
    price: '980',
    status: 'RECEIVED',
    image: images.babyCareImage2,
  },
  {
    id: '2',
    title: 'Sugar Free Gold Low Calorie Aspartame Sw..',
    info: '100 gm Powder',
    date: '21 May 2025',
    orderId: '#ORD123423',
    price: '130',
    status: 'CANCELLED',
    image: images.babyCareImage5,
  },
  {
    id: '3',
    title: 'Nestle Nan Pro Stage 2 Follow-Up Formula Mil..',
    info: 'tube of 30 ml Gel',
    date: '12 April 2025',
    orderId: '#ORD123423',
    price: '840',
    status: 'RECEIVED',
    image: images.babyCareImage5,
  },
  {
    id: '4',
    title: 'Cetaphil Baby Daily lotion, 400 ml',
    info: 'tube of 400 ml Gel',
    date: '02 April 2025',
    orderId: '#ORD123423',
    price: '710',
    status: 'RECEIVED',
    image: images.babyCareImage5,
  },
];

export default function PastOrders() {
  const renderItem = ({ item }: { item: Order }) => (
    <View className="mb-3 rounded-xl border border-gray bg-white p-4 shadow-md">
      {/* Top Row */}
      <View className="flex-row gap-6">
        <Image source={item.image} className="h-20 w-20" resizeMode="contain" />

        {/* Right side */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="w-56 font-RobotoRegular text-[15px] font-medium">{item.title}</Text>
            <TouchableOpacity>
              <MaterialIcons name="more-vert" size={22} color="gray" />
            </TouchableOpacity>
          </View>

          <Text className="mt-2 text-[12px] text-[#666666]">{item.info}</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-500 mt-1 text-[12px] font-medium">
              Order ID: {item.orderId}
            </Text>
            <Text className="mr-5 mt-1 text-[16px] font-bold text-teal-700">₹{item.price}</Text>
          </View>
        </View>
      </View>

      {/* Footer Row */}
      <View className="mt-4 flex-row items-center justify-between">
        <View className="flex-row  items-center justify-center gap-6">
          <Text className="text-gray-500 text-[12px] font-semibold">{item.date}</Text>

          <Text
            className={`text-[12px] font-medium ${
              item.status === 'RECEIVED' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {item.status === 'RECEIVED' ? 'RECEIVED ORDER' : 'CANCELLED ORDER'}
          </Text>
        </View>

        <View>
          <TouchableOpacity className="rounded-lg bg-[#317C80] px-4 py-1.5">
            <Text className="text-[13px] font-semibold text-white">Record</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="bg-gray-100 flex-1 px-4 pt-4">
      <View className="mb-2 flex-row justify-center">
        <TouchableOpacity className="mb-2 rounded-l-md bg-[#EDEDED] px-6 py-3">
          <Text className="text-gray-700 text-[13px] font-semibold">UPCOMING</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mb-2 rounded-r-md bg-[#317C80] px-6 py-3">
          <Text className="text-[13px] font-semibold text-white">PAST ORDER</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
