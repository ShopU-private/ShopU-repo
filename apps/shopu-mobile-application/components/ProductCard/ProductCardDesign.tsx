import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Product {
  image?: ImageSourcePropType;
  title?: string;
  description?: string;
  volume?: string;
  mrp?: number;
  price?: number;
  discount?: string;
}

interface ProductCardProps {
  product: Product;
}

const productCardDesignStyle = {
  textCommonDesign: 'font-RobotoRegular text-[11px] text-[#666666]',
};

const ProductCardDesign: React.FC<ProductCardProps> = ({ product }) => {
  const [add, setAdd] = useState(true);

  return (
    <View className="w-[170px] rounded-lg border border-[#ededed] bg-white p-4 shadow-sm">
      <View className="mb-2 flex flex-row items-start justify-between">
        <Image
          source={product.image}
          className="h-[90px] w-[120px] rounded-md"
          resizeMode="contain"
        />
        <TouchableOpacity onPress={() => setAdd(!add)}>
          {add ? (
            <Icon name="heart-o" size={20} color="#a8a5a5ff" />
          ) : (
            <Icon name="heart" size={20} color={'#317c80'} />
          )}
        </TouchableOpacity>
      </View>
      <View className="mb-1">
        <Text
          className="font-RobotoRegular text-[13px] leading-tight text-[#2d2d2d]"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.title}
        </Text>
      </View>
      <View className="mb-2">
        <Text className={productCardDesignStyle.textCommonDesign}>{product.volume}</Text>
        <View className="mt-1 h-[1px] w-full bg-[#e5e5e5]" />
      </View>
      <View className="mb-2 flex flex-row items-center gap-2">
        <Text className={productCardDesignStyle.textCommonDesign}>MRP</Text>
        <Text className={`${productCardDesignStyle.textCommonDesign} line-through`}>
          ₹{product.mrp}
        </Text>
        <Text className="font-RobotoRegular text-primary-semiBold text-[11px]">
          {product.discount}
        </Text>
      </View>
      <View className="flex flex-row items-center justify-between">
        <Text className="font-RobotoMedium text-primary-bold text-[18px]">₹{product.price}</Text>
        <TouchableOpacity className="bg-primary-bold rounded-md px-5 py-2">
          <Text className="font-RobotoMedium text-white">Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductCardDesign;
