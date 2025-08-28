import React, {useEffect, useState} from 'react';
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
  Button,
  Alert,
} from 'react-native';
import {SCREEN_HEIGHT} from '../../Utils/Dimensions';
import AggregatesComponent from '../../pages/Dashboard/AggregatesComponent';
import RMCComponent from '../../pages/Dashboard/RMCComponent';
import BricksComponent from '../../pages/Dashboard/BricksComponent';
import AggregateFlow from '../../pages/Dashboard/AggregateFlow';
import BricksFlow from '../../pages/Dashboard/BricksFlow';
import {SvgUri} from 'react-native-svg';
import {ColorableSvgIcon, FilterIcon} from '../../Utils/Icons';
const searchIcon =
  'https://d3b1cj4ht2fm8t.cloudfront.net/staging/Consumer_App_Final/search.svg';
const categories = [
  {
    id: '1',
    name: 'Aggregates',
    icon: 'https://d3b1cj4ht2fm8t.cloudfront.net/staging/Consumer_App_Final/aggregates.svg',
  },
  {
    id: '2',
    name: 'Bricks',
    icon: 'https://d3b1cj4ht2fm8t.cloudfront.net/staging/Consumer_App_Final/bricks.svg',
  },
  {
    id: '3',
    name: 'RMC',
    icon: 'https://d3b1cj4ht2fm8t.cloudfront.net/staging/Consumer_App_Final/rmc.svg',
  },
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const location = useSelector(state => state.Header.location);

  // State for managing selected category, search, and filters
  const [selectedCategory, setSelectedCategory] = useState('1'); // Default to Aggregates
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    priceRange: '',
    availability: '',
    brand: '',
    // Add more filter properties as needed
  });

  // Selected products per category
  const [selectedAggregateProduct, setSelectedAggregateProduct] =
    useState(null);
  const [selectedBricksProduct, setSelectedBricksProduct] = useState(null);
  const [selectedRMCProduct, setSelectedRMCProduct] = useState(null);

  // Modals visibility
  const [showAggregateModal, setShowAggregateModal] = useState(false);
  const [showBricksModal, setShowBricksModal] = useState(false);
  const [showRMCModal, setShowRMCModal] = useState(false);

  useEffect(() => {
    const initLoc = async () => {
      try {
        if (
          !location ||
          !location.latitude ||
          !location.longitude ||
          location.address === 'Location Unavailable !'
        ) {
          const controller = new AbortController(); // ✅ create controller

          const coords = await getCurrentLocation({
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 1000,
          });
          const place = await fetchPlaceDetailsFromCoords(
            coords.latitude,
            coords.longitude,
            controller,
          );
          const locationObj = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            address:
              place?.name || place?.formatted_address || 'Current Location',
            isServiceable: true,
          };
          dispatch(setLocationData(locationObj));
        }
      } catch (err) {
        console.warn('Failed to fetch location:', err);
      }
    };

    initLoc();
  }, [dispatch, location]);

  const handleCategorySelect = categoryId => {
    setSelectedCategory(categoryId);
  };

  const handleFilterPress = () => {
    // Open filter modal or bottom sheet
    console.log('Open filters');
  };

  // Reset all products and modals except current
  const clearOtherSelections = category => {
    if (category !== '1') {
      setSelectedAggregateProduct(null);
      setShowAggregateModal(false);
    }
    if (category !== '2') {
      setSelectedBricksProduct(null);
      setShowBricksModal(false);
    }
    if (category !== '3') {
      setSelectedRMCProduct(null);
      setShowRMCModal(false);
    }
  };

  // Handlers per category
  const handleBuyAggregates = product => {
    clearOtherSelections('1');
    setSelectedAggregateProduct(product);
    setShowAggregateModal(true);
    // Custom logic for Aggregates buy flow
  };

  const handleBuyBricks = product => {
    clearOtherSelections('2');
    setSelectedBricksProduct(product);
    setShowBricksModal(true);
    // Custom logic for Bricks buy flow
  };

  const handleBuyRMC = product => {
    clearOtherSelections('3');
    setSelectedRMCProduct(product);
    setShowRMCModal(true);
    // Custom logic for RMC buy flow
  };

  const renderCategoryComponent = () => {
    if (!selectedCategory) return null;

    const commonProps = {
      searchText,
      filters,
    };

    switch (selectedCategory) {
      case '1':
        return (
          <AggregatesComponent {...commonProps} onBuy={handleBuyAggregates} />
        );
      case '2':
        return <BricksComponent {...commonProps} onBuy={handleBuyBricks} />;
      case '3':
        return <RMCComponent {...commonProps} onBuy={handleBuyRMC} />;
      default:
        return null;
    }
  };

  // Main dashboard view
  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 30}}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <SvgUri uri={searchIcon} style={styles.searchIcon} />
            <TextInput
              placeholder="Search Materials..."
              style={styles.searchInput}
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}>
            <FilterIcon />
          </TouchableOpacity>
        </View>

        {/* Discount Banner */}
        {/* <TouchableOpacity activeOpacity={0.8} style={styles.bannerContainer}>
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
        </TouchableOpacity> */}

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesRow}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryItem,
                  selectedCategory === cat.id && styles.categoryItemSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => handleCategorySelect(cat.id)}>
                <View
                  style={[
                    styles.categoryIcon,
                    selectedCategory === cat.id && styles.categoryIconSelected,
                  ]}>
                  <ColorableSvgIcon
                    url={cat.icon}
                    color={selectedCategory === cat.id ? 'white' : '#148B7E'} // Set active/inactive color
                    style={{width: 35, height: 35}}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryName,
                    selectedCategory === cat.id && styles.categoryNameSelected,
                  ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Category Component */}
        {renderCategoryComponent()}

        <View style={{height: SCREEN_HEIGHT * 0.3}} />
      </ScrollView>

      {showAggregateModal && (
        <AggregateFlow
          visible={showAggregateModal}
          onClose={() => {
            setShowAggregateModal(false);
          }}
          selectedAggregate={selectedAggregateProduct.name}
        />
      )}

      {showBricksModal && (
        <BricksFlow
          visible={showBricksModal}
          onClose={() => {
            setShowBricksModal(false);
          }}
          selectedBrick={selectedBricksProduct.name}
        />
      )}
    </>
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
    alignItems: 'center',
    marginBottom: 20,
  },

  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 44,
  },

  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
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
    borderWidth: 1,
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
  categoryItemSelected: {
    transform: [{scale: 1.05}],
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e5f0ef',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#16968b',
  },
  categoryIconSelected: {
    backgroundColor: '#16968b',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  categoryNameSelected: {
    color: '#16968b',
    fontWeight: '700',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 6,
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
