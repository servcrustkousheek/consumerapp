import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

const RMCComponent = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{uri: 'https://via.placeholder.com/150?text=🚧'}}
        style={styles.image}
      />
      <Text style={styles.title}>Coming Soon</Text>
      <Text style={styles.subtitle}>
        We’re working hard to bring this feature to you!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default RMCComponent;
