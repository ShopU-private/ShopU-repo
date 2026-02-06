import { images } from '@/constants';
import { useAuth } from '@/context/authContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Pencil, LogOut, ChevronRight } from 'lucide-react-native';
import { Text, TouchableOpacity, View, Image } from 'react-native';

const Account = () => {
  const { setIsLoggedIn, setPhoneNumber } = useAuth();
  const router = useRouter();
  const displayPhone = '+91 124567890';
  const displayName = 'MD TAUSIF ALAM';

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setIsLoggedIn(false);
    setPhoneNumber('');
    router.replace('/(auth)/welcome');
  };

  return (
    <View className="flex-1 px-4 py-8">
      <View className="mb-5 rounded-2xl bg-[#317C80] p-4">
        <View className="flex-row items-center">
          <View className="rounded-full bg-white p-2.5">
            <Image source={images.Profile} className="h-10 w-9 " />
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-base font-medium text-white">{displayPhone}</Text>
            <Text className="mt-1 text-sm text-white">{displayName}</Text>
          </View>
          <TouchableOpacity className="pr-4" accessibilityLabel="Edit profile">
            <Pencil size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-5 rounded-xl bg-white py-2 shadow-md">
        <TouchableOpacity className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center">
            <View className="rounded-full bg-[#317C80] p-2">
              <Image source={images.map} className="h-8 w-8" />
            </View>

            <View className="ml-3">
              <Text className="text-gray-800 text-[15px] font-medium">My Address</Text>
              <Text className="mt-0.5 font-RobotoRegular text-sm text-[#666666]">
                Make changes to your address
              </Text>
            </View>
          </View>
          <ChevronRight size={22} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center">
            <View className="rounded-full bg-[#317C80] p-2">
              <Image source={images.wallet} className="h-8 w-8" />
            </View>

            <View className="ml-3">
              <Text className="text-gray-800 text-[15px] font-medium">Payment Method</Text>
              <Text className="mt-0.5 font-RobotoRegular text-sm text-[#666666]">
                Choose Your Payment Method
              </Text>
            </View>
          </View>
          <ChevronRight size={22} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center">
            <View className="rounded-full bg-[#317C80] p-2">
              <Image source={images.help} className="h-8 w-8" />
            </View>

            <View className="ml-3">
              <Text className="text-gray-800 text-[15px] font-medium">FAQ & Help</Text>
              <Text className="mt-0.5 font-RobotoRegular text-sm text-[#666666]">
                quick answers to your common questions
              </Text>
            </View>
          </View>
          <ChevronRight size={22} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-between p-4"
        >
          <View className="flex-row items-center">
            <View className="rounded-full bg-[#317C80] p-3">
              <LogOut size={22} color="#ffffff" />
            </View>

            <View className="ml-3">
              <Text className="text-gray-800 text-[15px] font-medium">Log out</Text>
              <Text className="mt-0.5 font-RobotoRegular text-sm text-[#666666]">
                Further secure your account for safety
              </Text>
            </View>
          </View>
          <ChevronRight size={22} color="#999" />
        </TouchableOpacity>
      </View>

      <Text className="text-md text-gray-700 mb-2 ml-1 font-semibold">More</Text>
      <View className="rounded-xl bg-white py-2 shadow-md">
        <TouchableOpacity className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center">
            <View className="rounded-full bg-[#317C80] p-2">
              <Image source={images.support} className="h-8 w-8" />
            </View>

            <View className="ml-3">
              <Text className="text-gray-800 text-[15px] font-medium">Customer Support</Text>
              <Text className="mt-0.5 font-RobotoRegular text-sm text-[#666666]">
                We’re here to help! Choose a support option.
              </Text>
            </View>
          </View>
          <ChevronRight size={22} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between p-4">
          <View className="flex-row items-center">
            <View className="rounded-full bg-[#317C80] p-2">
              <Image source={images.about} className="h-8 w-8" />
            </View>

            <View className="ml-3">
              <Text className="text-gray-800 text-[15px] font-medium">About App</Text>
              <Text className="mt-0.5 font-RobotoRegular text-sm text-[#666666]">
                Get to know more about us and what we do.
              </Text>
            </View>
          </View>
          <ChevronRight size={22} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Account;
