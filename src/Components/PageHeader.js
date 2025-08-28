import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {BackIcon} from '../Utils/Icons';

const PageHeader = ({title = '', onBack}) => {
  return (
    <View style={styles.container}>
      {/* Left: Back icon */}
      <View style={styles.iconWrap}>
        <BackIcon
          color="white"
          backgroundColor="##17897E"
          size={50}
          onPress={onBack}
        />
      </View>

      {/* Center: Title absolutely centered */}
      <Text style={styles.title}>{title}</Text>

      {/* Right: Empty space to balance the back icon */}
      <View style={styles.placeholder} />
    </View>
  );
};

export default PageHeader;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17897E',
    paddingVertical: 13,
    paddingHorizontal: 12,
  },
  iconWrap: {
    zIndex: 1,
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  placeholder: {
    width: 50, // Same width as the back icon to balance layout
  },
});
