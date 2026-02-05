import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { images } from '@/constants';

export default function CartScreen() {
  const products = [
    {
      id: 1,
      title: 'Hamdard Sualin Natural cough & cold',
      qty: 1,
      price: 229,
      subtitle: '100 ml Syrup',
      mrp: 145,
      off: '22% OFF',
      image: images.coldAndCough1,
    },
    {
      id: 2,
      title: 'Himalaya Koflet Cough Lozenges',
      qty: 1,
      price: 129,
      subtitle: '100 ml Syrup',
      mrp: 165,
      off: '22% OFF',
      image: images.coldAndCough1,
    },
    {
      id: 3,
      title: 'Charak Ayurvedic Actives Kofol Chewbal',
      qty: 1,
      price: 363,
      subtitle: '100 ml Syrup',
      mrp: 625,
      off: '50% OFF',
      image: images.everydayMedicine1,
    },
    {
      id: 4,
      title: 'Waterbury’s Compound for Respiratory Heal',
      qty: 1,
      price: 126,
      subtitle: '100 ml Syrup',
      mrp: 148,
      off: '22% OFF',
      image: images.babyCareImage10,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-white px-4 py-3">
      {/* Product List */}
      {products.map(item => (
        <View key={item.id} className="flex-row items-center border-b border-gray py-3">
          <Image source={item.image} className="h-24 w-24 rounded-lg" resizeMode="contain" />

          <View className="ml-4 flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="w-56 font-RobotoRegular text-[15px] font-medium" numberOfLines={2}>
                {item.title}
              </Text>

              {/* Delete */}
              <TouchableOpacity className="p-2">
                <Trash2 size={22} color="#999" />
              </TouchableOpacity>
            </View>
            <Text className="my-1 font-RobotoRegular text-[11px] text-[#666666]">
              {item.subtitle}
            </Text>

            <View className="mt-1 flex-row items-center justify-between gap-4">
              <View className="mt-1 flex-row items-center gap-2">
                <Text className="text-xl font-medium text-[#317C80]">₹{item.price}</Text>
                <Text className=" font-RobotoRegular text-[11px] text-[#666666] line-through">
                  MRP ₹{item.mrp}
                </Text>
                <Text className=" text-xs text-green-600">{item.off}</Text>
              </View>

              {/* Quantity Control */}
              <View className="mt-2 flex-row items-center px-2">
                <TouchableOpacity className="border-gray-300 rounded-full border p-1">
                  <Minus size={16} color="#333" />
                </TouchableOpacity>

                <Text className="text-gray-800 mx-3 font-semibold">{item.qty}</Text>

                <TouchableOpacity className="border-gray-300 rounded-full border p-1">
                  <Plus size={16} color="#333" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ))}

      {/* Payment Summary */}
      <View className="mt-2 bg-white p-2">
        <Text className="mb-3 text-xl font-semibold text-[#317C80]">Payment Summary</Text>

        <View className="flex-row justify-between py-1">
          <Text className="text-[#666666]">Order Total</Text>
          <Text className="font-bold text-[#666666]">₹126.00</Text>
        </View>

        <View className="flex-row justify-between py-1">
          <Text className="text-[#666666]">Item Discount</Text>
          <Text className="font-bold text-[#666666]">₹30.00</Text>
        </View>

        <View className="flex-row justify-between py-1">
          <Text className="text-[#666666]">Coupon Discount</Text>
          <Text className="font-bold text-[#666666]">₹10.00</Text>
        </View>

        <View className="flex-row justify-between py-1">
          <Text className="text-[#666666]">Shipping</Text>
          <Text className="font-bold text-[#666666]">Free</Text>
        </View>

        {/* Coupon Row */}
        <View className="px-">
          <TouchableOpacity className="mt-4 flex-row items-center justify-between rounded-lg border border-dashed border-[#317C80] bg-[#DFF1F2] p-3">
            <Text className="font-semibold text-[#666666]">You saved on the order</Text>
            <Text className="font-semibold text-[#317C80]">Edit Coupon</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
