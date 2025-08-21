import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const CustomButton = ({children, onPress}) => {
  return (
    <TouchableOpacity
      style={{
        top: -38,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={onPress}>
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 10,
          // backgroundColor: 'red',
          //transform: [{ rotate: '45deg' }],
        }}>
        <View
          style={{
            flex: 1,
            //transform: [{ rotate: '-45deg' }],
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {children}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
