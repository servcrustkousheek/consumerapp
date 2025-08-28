import {Platform, PermissionsAndroid, Alert, Linking} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

/*
 * Request location permission cross-platform (Android/iOS)
 * @param {boolean} enableBackground - request background location if needed
 */
export async function requestLocationPermission(enableBackground = false) {
  if (Platform.OS === 'android') {
    try {
      // Step 1: request fine location
      const fine = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonPositive: 'OK',
        },
      );

      if (fine !== PermissionsAndroid.RESULTS.GRANTED) {
        return false;
      }

      // Step 2: optionally request background permission (Android 10+)
      if (enableBackground && Platform.Version >= 29) {
        const bg = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: 'Background Location',
            message:
              'Allow background location to continuously access your position even when the app is not visible.',
            buttonPositive: 'Open Settings',
          },
        );

        if (bg !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Background Permission Denied',
            'Enable it from settings to allow continuous tracking.',
            [{text: 'Open Settings', onPress: () => Linking.openSettings()}],
          );
          return false;
        }
      }
      return true;
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  } else {
    // iOS flow
    // iOS supports 'whenInUse' or 'always'
    const auth = await Geolocation.requestAuthorization(
      enableBackground ? 'always' : 'whenInUse',
    );
    return auth === 'granted' || auth === 'authorized';
  }
}

/*
 * Get the user's current location
 * @param {object} options geolocation options
 */
export async function getCurrentLocation(
  options = {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
) {
  const hasPerm = await requestLocationPermission();
  if (!hasPerm) return null;

  return new Promise(resolve => {
    Geolocation.getCurrentPosition(
      pos =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
      err => {
        console.warn('Geolocation error', err.code, err.message);
        resolve(null);
      },
      options,
    );
  });
}

// Utils/olaMapsUrtils.js
const OLA_API_KEY = 'alfWAECQqunPtTj6wxd5NUClwPKJybbtr6LvMaGK';
const GOOGLE_API_KEY = 'AIzaSyDVBU19npmqu3QOPGzVImtBt8kx_hbbwLY';
/*
 * Fetches autocomplete suggestions from Ola Maps API
 * @param {string} input - The input text from search
 * @returns {Promise<Array>} - List of prediction suggestions
 */
export const fetchOlaAutocomplete = async input => {
  if (!input.trim()) return [];

  try {
    const response = await fetch(
      `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
        input,
      )}&api_key=${OLA_API_KEY}`,
    );

    const data = await response.json();
    return data.predictions || [];
  } catch (error) {
    console.error('Error fetching autocomplete:', error);
    return [];
  }
};

/*
 * Fetches detailed place info from Ola Maps API
 * @param {string} placeId - The place_id from autocomplete
 * @returns {Promise<Object|null>} - Place details or null on error
 */
export const fetchOlaPlaceDetails = async placeId => {
  try {
    const response = await fetch(
      `https://api.olamaps.io/places/v1/details?place_id=${placeId}&api_key=${OLA_API_KEY}`,
    );

    const data = await response.json();
    const result = data.result || null;
    console.log(data, 'fetchOlaPlaceDetails');

    if (!result) return null;

    // Try to extract the formatted or full address
    const fullAddress =
      result.formatted_address ||
      result.display_address ||
      result.address ||
      '';

    return {
      ...result,
      fullAddress,
    };
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

export const fetchPlaceDetailsFromCoords = async (lat, lng, controller) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`,
      {signal: controller?.signal},
    );

    const data = await response.json();
    console.log(data, 'fetchPlaceDetailsFromCoords');

    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];

      return {
        name: result.formatted_address, // ✅ full readable address
        formatted_address: result.formatted_address,
        full_result: result, // optional: full raw response
      };
    }

    return null;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error('Error fetching Google place details from coords:', error);
    }
    return null;
  }
};

import AsyncStorage from '@react-native-async-storage/async-storage';

// Key used for storing addresses
const STORAGE_KEY = 'savedAddresses';

/*
 * Load saved addresses from AsyncStorage
 * @returns {Promise<Array>} An array of saved address objects or an empty array
 */
export const loadSavedAddresses = async () => {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (err) {
    console.error('Failed to load saved addresses:', err);
    return [];
  }
};

/*
 * Helper: Calculate distance in meters between two lat/lng points using Haversine formula
 */
const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth radius in meters
  const toRad = value => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/*
 * Save a new address to AsyncStorage if it's at least 10m away from all saved addresses
 * @param {Object} address - Address object with fullAddress, latitude, longitude
 * @returns {Promise<Array>} Updated list of saved addresses or unchanged if too close
 */
export const saveThisAddress = async address => {
  try {
    const currentAddresses = await loadSavedAddresses();

    const isFarEnough = currentAddresses.every(item => {
      const distance = getDistanceInMeters(
        address.latitude,
        address.longitude,
        item.latitude,
        item.longitude,
      );
      return distance >= 10;
    });

    if (!isFarEnough) {
      console.log('Address is too close to an existing one. Not saved.');
      return currentAddresses;
    }

    const newAddress = {
      id: Date.now().toString(),
      fullAddress: address.fullAddress,
      latitude: address.latitude,
      longitude: address.longitude,
    };

    const updatedAddresses = [...currentAddresses, newAddress];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAddresses));
    return updatedAddresses;
  } catch (err) {
    console.error('Failed to save address:', err);
    console.error('Failed to save address (details):', err, err.stack || '');

    throw err;
  }
};

export const deleteAddress = async id => {
  try {
    const currentAddresses = await loadSavedAddresses();
    const updatedAddresses = currentAddresses.filter(addr => addr.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAddresses));
    // setSavedAddresses(updatedAddresses);
    Alert.alert('Deleted', 'Address removed successfully');
  } catch (err) {
    Alert.alert('Error', 'Failed to delete address');
  }
};
