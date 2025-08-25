import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setLocationData} from '../../redux/slices/HeaderSlice';
import {
  getCurrentLocation,
  fetchPlaceDetailsFromCoords,
} from '../../Utils/geolocationUtils';
 
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
 
const categories = [
  {id: '1', name: 'Aggregates', icon: 'IconPlaceholder1'},
  {id: '2', name: 'Bricks', icon: 'IconPlaceholder2'},
  {id: '3', name: 'RMC', icon: 'IconPlaceholder3'},
];
 
const popularProducts = [
  {
    id: 'p1',
    name: '6mm Stone Aggregates',
    desc: 'Often used in projects like dams and retaining walls.',
    image:
      'https://images.unsplash.com/photo-1579102787339-c5820ab1ed53?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p2',
    name: '12mm Stone Aggregates',
    desc: 'Often used in projects like dams and retaining walls.',
    image:
      'https://images.unsplash.com/photo-1579102787327-2ffbad110de1?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p3',
    name: '6mm Stone Aggregates',
    desc: 'Often used in projects like dams and retaining walls.',
    image:
      'https://images.unsplash.com/photo-1579102787339-c5820ab1ed53?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p4',
    name: '40mm Stone Aggregates',
    desc: 'Often used in projects like dams and retaining walls.',
    image:
      'https://images.unsplash.com/photo-1590080877777-64f3fac5b682?auto=format&fit=crop&w=400&q=80',
  },
];
 
const Dashboard = () => {
  const dispatch = useDispatch();
  const location = useSelector(state => state.Header.location);
 
  useEffect(() => {
    const initLoc = async () => {
      try {
        // Only fetch current location if none saved yet
        if (
          !location ||
          !location.latitude ||
          !location.longitude ||
          location.address === 'Location Unavailable !'
        ) {
          const coords = await getCurrentLocation({
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 1000,
          });
          const place = await fetchPlaceDetailsFromCoords(
            coords.latitude,
            coords.longitude,
          );
          const locationObj = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            address:
              place?.name || place?.formatted_address || 'Current Location',
            isServiceable: false, // or insert your business logic here
          };
          dispatch(setLocationData(locationObj));
        }
      } catch (err) {
        console.warn('Failed to fetch location:', err);
      }
    };
 
    initLoc();
  }, [dispatch, location]);
 
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: 30}}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search Materials..."
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.filterButton}>
          {/* Replace below with your SVG filter icon */}
          <View style={styles.iconPlaceholder} />
        </TouchableOpacity>
      </View>
 
      {/* Discount Banner */}
      <TouchableOpacity activeOpacity={0.8} style={styles.bannerContainer}>
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
          }}
          style={styles.bannerImage}
          imageStyle={{borderRadius: 14}}>
          <View style={styles.bannerOverlay}>
            <Text style={styles.discountTitle}>Get 10% Discount</Text>
            <Text style={styles.discountSubtitle}>From Every order</Text>
          </View>
          <Text style={styles.bannerLabel}>Special for you</Text>
        </ImageBackground>
      </TouchableOpacity>
 
      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesRow}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              activeOpacity={0.7}>
              <View style={styles.categoryIcon}>
                {/* Replace with your SVG icon */}
                <View style={styles.iconPlaceholder} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
 
      {/* Popular Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Products</Text>
        <FlatList
          data={popularProducts}
          keyExtractor={item => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
          renderItem={({item}) => (
            <View style={styles.productCard}>
              <Image
                source={{uri: item.image}}
                style={styles.productImage}
                resizeMode="cover"
              />
              <Text style={styles.productName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.productDesc} numberOfLines={2}>
                {item.desc}
              </Text>
              <TouchableOpacity style={styles.buyButton} activeOpacity={0.8}>
                <Text style={styles.buyBtnText}>Buy</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
 
  bannerContainer: {
    height: 160,
    marginBottom: 25,
    borderRadius: 14,
    overflow: 'hidden',
  },
  bannerImage: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bannerOverlay: {
    position: 'absolute',
    left: 20,
    top: 45,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  discountTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.8,
  },
  discountSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  bannerLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 8,
  },
 
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#222',
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: 90,
    alignItems: 'center',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e5f0ef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
 
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '48%',
    // Shadow (iOS)
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    // Shadow (Android)
    elevation: 3,
    paddingBottom: 15,
  },
  productImage: {
    width: '100%',
    height: 110,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    paddingHorizontal: 10,
  },
  productDesc: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 10,
    marginTop: 3,
  },
  buyButton: {
    marginTop: 10,
    backgroundColor: '#16968b',
    marginHorizontal: 10,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buyBtnText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
});
 
export default Dashboard;
 