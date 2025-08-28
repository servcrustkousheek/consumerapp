// categories/AggregatesComponent.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
// categories/BricksComponent.js
const BricksComponent = ({searchText, filters, onBuy}) => {
  const [bricksData, setBricksData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const sampleBricks = [
    {
      id: 'brick1',
      name: 'Red Clay Bricks',
      price: '₹8/piece',
      description: 'Traditional red bricks for construction',
      image:
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=80',
      availability: 'In Stock',
      brand: 'Clay Master',
    },
    {
      id: 'brick2',
      name: 'Fly Ash Bricks',
      price: '₹6/piece',
      description: 'Eco-friendly fly ash bricks',
      image:
        'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=400&q=80',
      availability: 'In Stock',
      brand: 'EcoBrick',
    },
  ];

  useEffect(() => {
    setBricksData(sampleBricks);
    setFilteredData(sampleBricks);
  }, []);

  useEffect(() => {
    let filtered = bricksData;

    if (searchText) {
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.description.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    if (filters.availability && filters.availability !== '') {
      filtered = filtered.filter(
        item => item.availability === filters.availability,
      );
    }

    if (filters.brand && filters.brand !== '') {
      filtered = filtered.filter(item => item.brand === filters.brand);
    }

    setFilteredData(filtered);
  }, [searchText, filters, bricksData]);

  const renderBrickItem = ({item}) => (
    <View style={styles.productCard}>
      <Image source={{uri: item.image}} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => onBuy(item)}>
          <Text style={styles.buttonText}>Select</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Bricks</Text>
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={renderBrickItem}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 15,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#222',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '48%',
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(195, 195, 195, 0.93)',
    paddingBottom: 15,
    marginBottom: 10,
  },
  productImage: {
    width: '100%',
    height: 110,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16968b',
    marginBottom: 6,
  },
  productDesc: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    lineHeight: 16,
  },
  productBrand: {
    fontSize: 10,
    color: '#888',
    marginBottom: 4,
  },
  availability: {
    fontSize: 10,
    fontWeight: '600',
    marginBottom: 8,
  },
  addToCartButton: {
    backgroundColor: '#16968b',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
export default BricksComponent;
