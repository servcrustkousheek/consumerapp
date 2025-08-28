import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

// Dummy Data
const tyreTypes = [
  {
    key: '6w',
    title: '6 Wheel',
    subtitle: '250 -400 CFT / 10.64 -17.02 TONN',
  },
  {
    key: '10w',
    title: '10 Wheel',
    subtitle: '550 -750 CFT / 23.4 -31.91 TONN',
  },
  {
    key: '12w',
    title: '12 Wheel',
    subtitle: '800 -900 CFT / 34.04 -42.13 TONN',
  },
];

const SelectTyreType = () => {
  return (
    <View style={styles.container}>
      {/* Header bar with location and change link */}
      <View style={styles.headerBar}>
        {/* Placeholder for location icon */}
        <View style={styles.locIcon} />
        <Text style={styles.locationTxt} numberOfLines={1} ellipsizeMode="tail">
          Vinayaka best backery & Sweets,
        </Text>
        <TouchableOpacity>
          <Text style={styles.changeTxt}>Change</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {tyreTypes.map(t => (
          <TouchableOpacity key={t.key} style={styles.card} activeOpacity={0.8}>
            <View style={styles.cardTextWrapper}>
              <Text style={styles.cardTitle}>{t.title}</Text>
              <Text style={styles.cardSubtitle}>{t.subtitle}</Text>
            </View>
            {/* Placeholder for chevron arrow */}
            <View style={styles.arrowPlaceholder}>
              {/* Simple SVG for chevron (>, right) */}
              <View
                style={{
                  width: 0,
                  height: 0,
                  borderTopWidth: 8,
                  borderTopColor: 'transparent',
                  borderBottomWidth: 8,
                  borderBottomColor: 'transparent',
                  borderLeftWidth: 12,
                  borderLeftColor: '#bdbdbd',
                  marginLeft: 8,
                }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 14,
    backgroundColor: '#f8f8f8',
    flex: 1,
  },
  headerBar: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed',
  },
  locIcon: {
    width: 14,
    height: 14,
    backgroundColor: '#ff4d4f', // placeholder for map pin
    borderRadius: 7,
    marginRight: 7,
  },
  locationTxt: {
    flex: 1,
    fontSize: 15,
    color: '#444',
  },
  changeTxt: {
    fontSize: 14,
    color: '#0096e5',
    fontWeight: '600',
    marginLeft: 6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 9,
    marginBottom: 13,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 19,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  cardTextWrapper: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    color: '#2e2e2e',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#989898',
    fontSize: 13,
    fontWeight: '500',
  },
  arrowPlaceholder: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelectTyreType;
