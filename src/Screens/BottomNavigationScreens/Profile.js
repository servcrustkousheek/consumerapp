import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import OrderDetails from '../../pages/Dashboard/OrderDetailsCheckout';

const Profile = () => {
  const [selectedCategory, setSelectedCategory] = useState('Bricks');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Page</Text>

      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setSelectedCategory('Bricks')}>
          <View style={styles.radioCircle}>
            {selectedCategory === 'Bricks' && (
              <View style={styles.selectedDot} />
            )}
          </View>
          <Text style={styles.radioLabel}>Bricks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioOption}
          onPress={() => setSelectedCategory('Aggregate')}>
          <View style={styles.radioCircle}>
            {selectedCategory === 'Aggregate' && (
              <View style={styles.selectedDot} />
            )}
          </View>
          <Text style={styles.radioLabel}>Aggregate</Text>
        </TouchableOpacity>
      </View>

      <OrderDetails category={selectedCategory} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#f44336',
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default Profile;
