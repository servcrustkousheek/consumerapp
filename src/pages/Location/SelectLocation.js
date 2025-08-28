import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {
  deleteAddress,
  fetchOlaAutocomplete,
  fetchOlaPlaceDetails,
  fetchPlaceDetailsFromCoords,
  getCurrentLocation,
  loadSavedAddresses,
  savedLocations,
  saveThisAddress,
} from '../../Utils/geolocationUtils';
import {SCREEN_HEIGHT} from '../../Utils/Dimensions';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg, {Line} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DeleteIcon, LocationIcon} from '../../Utils/Icons';
import {useDispatch, useSelector} from 'react-redux';
import {setLocationData} from '../../redux/slices/HeaderSlice';
import {useNavigation} from '@react-navigation/native';
const XIcon = () => (
  <Svg height="20" width="20" viewBox="0 0 20 20">
    <Line x1="4" y1="4" x2="16" y2="16" stroke="black" strokeWidth="2" />
    <Line x1="16" y1="4" x2="4" y2="16" stroke="black" strokeWidth="2" />
  </Svg>
);

const SelectLocation = () => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [savedAddresses, setSavedAddresses] = useState([]);

  const mapRef = useRef(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const initializeLocation = async () => {
    setLoading(true);
    const controller = new AbortController(); // ✅ create controller

    try {
      const coords = await getCurrentLocation({
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 1000,
      });

      const placeDetails = await fetchPlaceDetailsFromCoords(
        coords.latitude,
        coords.longitude,
        controller, // ✅ pass controller
      );

      const name =
        placeDetails?.name ||
        placeDetails?.formatted_address ||
        'Current Location';

      setSelectedPosition({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      setSelectedPlaceName(name);
      setSearchText(name);

      mapRef.current?.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000,
      );
    } catch (error) {
      console.error('Initialization error:', error);
      Alert.alert('Location Error', 'Could not fetch current location.');
    } finally {
      setLoading(false);
    }
  };

  const storedLocation = useSelector(state => state.Header?.location);

  useEffect(() => {
    const init = async () => {
      const addresses = await loadSavedAddresses();
      setSavedAddresses(addresses);

      // Use stored location if available and valid
      if (
        storedLocation &&
        storedLocation.latitude &&
        storedLocation.longitude &&
        storedLocation.address &&
        storedLocation.address !== 'Location Unavailable !'
      ) {
        setSelectedPosition({
          latitude: storedLocation.latitude,
          longitude: storedLocation.longitude,
        });
        setSelectedPlaceName(storedLocation.address);
        setSearchText(storedLocation.address);
        setLoading(false);
        // Animate the map if needed:
        mapRef.current?.animateToRegion(
          {
            latitude: storedLocation.latitude,
            longitude: storedLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000,
        );
      } else {
        // fallback: get current GPS coordinates
        initializeLocation();
      }
    };

    init();
    // Optionally add storedLocation to deps if you want it to respond to changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLongPress = async event => {
    const {coordinate} = event.nativeEvent;
    setSelectedPosition(coordinate);

    const controller = new AbortController(); // ✅ create controller

    const details = await fetchPlaceDetailsFromCoords(
      coordinate.latitude,
      coordinate.longitude,
      controller, // ✅ pass controller
    );

    const name =
      details?.name || details?.formatted_address || 'Pinned Location';

    setSelectedPlaceName(name);
    setSearchText(name);
  };

  const fetchSuggestions = async text => {
    setSearchText(text);
    const predictions = await fetchOlaAutocomplete(text);
    setSuggestions(predictions);
  };

  const handleSelectPlace = async place => {
    const result = await fetchOlaPlaceDetails(place.place_id);
    console.log('handleSelectPlace', result);

    if (result) {
      const {lat, lng} = result.geometry.location;
      const newCoords = {latitude: lat, longitude: lng};

      // Use fullAddress from the result
      const fullAddress =
        result.fullAddress ||
        result.formatted_address ||
        result.display_address ||
        place.description;

      // Update map position
      setSelectedPosition(newCoords);

      // Save or display place name
      setSelectedPlaceName(fullAddress);

      // Optionally save full address separately if needed
      // setSelectedFullAddress(fullAddress);

      // Move the map
      mapRef.current?.animateToRegion(
        {
          ...newCoords,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000,
      );

      // Clear suggestions and update input
      setSuggestions([]);
      setSearchText(fullAddress || place.description);
    }
  };

  if (loading || !selectedPosition) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  const clearSearch = () => {
    setSearchText('');
    setSuggestions([]);
  };
  const handlePress = item => {
    console.log('Pressed:', item);

    const newCoords = {latitude: item?.latitude, longitude: item?.longitude};

    // Update map position
    setSelectedPosition(newCoords);

    // Save or display place name
    setSelectedPlaceName(item?.fullAddress);

    // Move the map
    mapRef.current?.animateToRegion(
      {
        ...newCoords,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000,
    );

    // Clear suggestions and update input
    setSuggestions([]);
    setSearchText(item?.fullAddress);
  };

  const renderItem = ({item}) => (
    <View style={styles.addressItem}>
      <TouchableOpacity
        style={styles.cardRow}
        onPress={() => handlePress(item)}
        activeOpacity={0.8}>
        {/* Left: Location Icon */}
        <View style={styles.iconColumn}>
          <LocationIcon width={22} height={22} color="#148B7E" />
        </View>

        {/* Center: Address Text */}
        <View style={styles.addressContent}>
          <Text style={styles.addressText}>{item.fullAddress}</Text>
          <Text style={styles.coordsText}>
            {/* Lat: {item.latitude}, Lng: {item.longitude} */}
          </Text>
        </View>

        {/* Right: Delete Icon */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            Alert.alert(
              'Delete Address',
              'Are you sure you want to delete this address?',
              [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    await deleteAddress(item.id);
                    const addresses = await loadSavedAddresses();
                    setSavedAddresses(addresses);
                  },
                },
              ],
            );
          }}>
          <DeleteIcon width={20} height={20} color="#cc3d3dff" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  const handleSaveAddress = async () => {
    if (!selectedPlaceName || !selectedPosition) {
      Alert.alert('Missing Info', 'Place name or coordinates are missing');
      return;
    }

    const lat = Number(selectedPosition.latitude);
    const lng = Number(selectedPosition.longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      Alert.alert(
        'Invalid Address',
        `Latitude: ${selectedPosition.latitude}, Longitude: ${selectedPosition.longitude}`,
      );
      return;
    }

    const newAddress = {
      fullAddress: selectedPlaceName,
      latitude: lat,
      longitude: lng,
    };

    try {
      const updated = await saveThisAddress(newAddress);

      // The address wasn't saved because it's too close; function returns previous list.
      const alreadyExists = updated.some(
        addr =>
          Math.abs(addr.latitude - newAddress.latitude) < 0.00001 &&
          Math.abs(addr.longitude - newAddress.longitude) < 0.00001,
      );

      // If the address is too close, saveThisAddress just returns the old list,
      // so if the length didn't change, show "too close" alert.
      if (updated.length === savedAddresses.length) {
        Alert.alert('Not Saved', 'Address is too close to an existing one.');
      } else {
        setSavedAddresses(updated);
        Alert.alert('Success', 'Address saved successfully');
      }
    } catch (err) {
      Alert.alert('Error', `Failed to save address: ${err.message || err}`);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        <View style={styles.title}>
          <Text style={styles.titleText}>Location Access</Text>
        </View>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          {/* Your entire UI inside this ScrollView */}
          <View style={{flex: 1}}>
            {/* <View style={styles.title}>
              <Text style={styles.titleText}>Location Access</Text>
            </View> */}
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: selectedPosition.latitude,
                longitude: selectedPosition.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onLongPress={handleLongPress}
              showsUserLocation={true}
              showsMyLocationButton={false}
              zoomControlEnabled={true}
              scrollEnabled={true}
              zoomEnabled={true}
              pitchEnabled={true}
              rotateEnabled={true}>
              {selectedPosition && <Marker coordinate={selectedPosition} />}
            </MapView>
            <View style={styles.coordinatesRow}>
              <View style={styles.coordinates}>
                <Text style={styles.placeText}>{selectedPlaceName}</Text>
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAddress}>
                <Text style={styles.saveButtonText}>Save Address</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <Text>icon</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Search for location"
                value={searchText}
                onChangeText={fetchSuggestions}
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  onPress={clearSearch}
                  style={styles.clearButton}>
                  <XIcon />
                </TouchableOpacity>
              )}
            </View>
            {/* Current Location Button */}
            <TouchableOpacity
              style={styles.currLocBtn}
              onPress={initializeLocation}>
              <Text>icon</Text>
              <Text style={styles.currLocText}>Use My Current Location</Text>
            </TouchableOpacity>
            {/* Suggestions List */}
            {suggestions.length > 0 && (
              <FlatList
                // scrollEnabled={false}
                data={suggestions}
                keyExtractor={item => item.place_id}
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSelectPlace(item)}>
                    <Text>{item.description}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
            <View style={styles.savedContainer}>
              <Text style={styles.headerText}>Saved Address</Text>
              <FlatList
                // scrollEnabled={false}
                data={savedAddresses}
                keyExtractor={item => item.id}
                renderItem={renderItem}
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                // Alert.alert('Proceed Pressed');
                const data = {
                  latitude: selectedPosition.latitude,
                  longitude: selectedPosition.longitude,
                  address: selectedPlaceName,
                  isServiceable: true,
                };
                dispatch(setLocationData(data));
                navigation.goBack();
              }}
              activeOpacity={0.7}>
              <Text style={styles.text}>Proceed</Text>
            </TouchableOpacity>
          </View>
          <View style={{height: SCREEN_HEIGHT * 0.3, width: '100%'}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingBottom: 100,
    // marginBottom: 100,
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#148B7E',
    paddingTop: 40,
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 500,
  },
  map: {
    height: SCREEN_HEIGHT * 0.3,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coordinatesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  coordinates: {
    flex: 1,
  },
  placeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    // marginTop: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    paddingHorizontal: 10,
    width: '90%',
    alignSelf: 'center',
    height: 50,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  clearButton: {
    padding: 5,
  },
  currLocBtn: {
    flexDirection: 'row',
    margin: 10,
    padding: 12,
    borderRadius: 8,
    // alignItems: 'center',
  },
  currLocText: {
    color: '#148B7E',
    fontWeight: '600',
    marginLeft: 20,
  },
  suggestionsList: {
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    // maxHeight: 200,
  },
  suggestionItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  savedContainer: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addressItem: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconColumn: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addressContent: {
    flex: 1,
    justifyContent: 'center',
  },

  addressText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },

  coordsText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },

  deleteButton: {
    paddingLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#148B7E', // Teal-like color
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SelectLocation;
