import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Svg, {Path, Circle} from 'react-native-svg';
import {useSelector} from 'react-redux';
 
const STATUSBAR_HEIGHT =
  Platform.OS === 'ios' ? 20 : StatusBar.currentHeight || 24;
 
const LocationIcon = () => (
  <Svg width={27} height={27} viewBox="0 0 24 24">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
      fill="none"
      stroke="#fff"
      strokeWidth={2}
    />
    <Circle cx={12} cy={9} r={2.5} fill="none" stroke="#fff" strokeWidth={2} />
  </Svg>
);
 
const BellIcon = () => (
  <View
    style={{
      width: 29,
      height: 29,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
    <Svg width={26} height={26} viewBox="0 0 24 24">
      <Path
        d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-1 1v1h16v-1l-1-1z"
        fill="none"
        stroke="#fff"
        strokeWidth={2}
      />
    </Svg>
    <View
      style={{
        position: 'absolute',
        top: 3,
        right: 3,
        width: 9,
        height: 9,
        borderRadius: 4.5,
        backgroundColor: 'red',
        borderWidth: 1.5,
        borderColor: '#16968b',
      }}
    />
  </View>
);
 
const Header = ({route, navigation}) => {
  const {location} = useSelector(state => state.Header);
  return (
    <View
      style={[
        styles.container,
        {paddingTop: STATUSBAR_HEIGHT, height: 62 + STATUSBAR_HEIGHT},
      ]}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('SelectLocation');
        }}>
        <View style={styles.leftSection}>
          <LocationIcon />
          <View>
            <Text style={styles.label}>Deliver to:</Text>
            <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
              {location.isServiceable
                ? location.address
                : 'Not serviceable in this area'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <BellIcon />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#16968b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    justifyContent: 'space-between',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    color: 'white',
    fontSize: 16,
    marginLeft: 3,
    marginBottom: 1,
  },
  address: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
    marginLeft: 3,
    width: 250,
    lineHeight: 24,
  },
});
 
export default Header;