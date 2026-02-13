import React from 'react';
import { Image, ImageSourcePropType, Text, View } from 'react-native';

interface NotificationCardProps {
  title: string;
  message: string;
  sentAt: Date;
  image: ImageSourcePropType;
}

const NotificationCard = ({ title, message, sentAt, image }: NotificationCardProps) => {
  const timeString =
    sentAt instanceof Date && !isNaN(sentAt.getTime())
      ? sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      : '--:--';

  return (
    <View className="flex flex-row items-start rounded-xl border border-[#e0e0e0] bg-white px-5 py-4 shadow-md">
      <View className="mr-4">
        <Image source={image} className="h-[50px] w-[50px] rounded-full" />
      </View>
      <View className="flex-1">
        <View className="mb-2 flex flex-row items-center justify-between">
          <Text className="text-base font-semibold text-[#222]" numberOfLines={1}>
            {title}
          </Text>
          <Text className="text-xs text-[#888]" numberOfLines={1}>
            {timeString}
          </Text>
        </View>
        <View>
          <Text className="text-sm text-[#444]">{message}</Text>
        </View>
      </View>
    </View>
  );
};

export default NotificationCard;
