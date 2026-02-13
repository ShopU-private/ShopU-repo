import React from 'react';
import { View } from 'react-native';
import SearchBar from './searchBar';

const CustomSearchHeader = () => {
  return (
    <View
      style={{
        backgroundColor: '#317C80',
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 40,
      }}
    >
      <SearchBar />
    </View>
  );
};

export default CustomSearchHeader;
