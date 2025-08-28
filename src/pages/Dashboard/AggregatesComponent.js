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
import AggregateFlow from './AggregateFlow';

const AggregatesComponent = ({searchText, filters, onBuy}) => {
  const [aggregatesData, setAggregatesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [aggFlow, setAggFlow] = useState(false);

  // Sample data for aggregates
  const sampleAggregates = [
    {
      id: 'agg1',
      name: '6mm Stone Aggregates',
      price: '₹45/kg',
      description: 'High-quality stone aggregates for concrete work',
      image:
        'https://images.unsplash.com/photo-1579102787339-c5820ab1ed53?auto=format&fit=crop&w=400&q=80',
      availability: 'In Stock',
      brand: 'Premium Stone',
    },
    {
      id: 'agg2',
      name: '12mm Stone Aggregates',
      price: '₹48/kg',
      description: 'Medium-sized aggregates for construction',
      image:
        'https://images.unsplash.com/photo-1579102787327-2ffbad110de1?auto=format&fit=crop&w=400&q=80',
      availability: 'In Stock',
      brand: 'Quality Mix',
    },
    {
      id: 'agg3',
      name: '20mm Stone Aggregates',
      price: '₹50/kg',
      description: 'Large aggregates for heavy construction',
      image:
        'https://images.unsplash.com/photo-1590080877777-64f3fac5b682?auto=format&fit=crop&w=400&q=80',
      availability: 'Limited Stock',
      brand: 'BuildMaster',
    },
  ];

  useEffect(() => {
    // Initialize data (you can replace this with API call)
    setAggregatesData(sampleAggregates);
    setFilteredData(sampleAggregates);
  }, []);

  useEffect(() => {
    // Filter data based on search text and filters
    let filtered = aggregatesData;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.description.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    // Apply other filters
    if (filters.availability && filters.availability !== '') {
      filtered = filtered.filter(
        item => item.availability === filters.availability,
      );
    }

    if (filters.brand && filters.brand !== '') {
      filtered = filtered.filter(item => item.brand === filters.brand);
    }

    setFilteredData(filtered);
  }, [searchText, filters, aggregatesData]);

  const renderAggregateItem = ({item}) => (
    <View style={styles.productCard}>
      <Image source={{uri: item.image}} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDesc}>{item.description}</Text>

        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => onBuy(item)}>
          <Text style={styles.buttonText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Aggregates</Text>
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={renderAggregateItem}
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
    flex: 1,
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

    // iOS shadow
    // shadowColor: '#3E4A59',
    // shadowOffset: {width: 0, height: 4},
    // shadowOpacity: 0.15,
    // shadowRadius: 6,

    // Android shadow
    // elevation: 8,
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
    backgroundColor: '#b3c3d7ff',
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

export default AggregatesComponent;
