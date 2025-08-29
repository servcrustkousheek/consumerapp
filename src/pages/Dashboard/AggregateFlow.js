import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import BottomSheet from '../../Components/BottomSheet';
import {ChevronRightIcon, LocationIcon} from '../../Utils/Icons';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const AggregateFlow = ({visible, onClose, selectedAggregate}) => {
  const [selectedTyreType, setSelectedTyreType] = useState('');

  const tyreOptions = [
    {id: 'tractor-2000-3000', label: 'Tractor (2000-3000)'},
    {id: '6-tyre-3001-6000', label: '6 Tyre (3001-6000)'},
    {id: '10-tyre-6001-10000', label: '10 Tyre (6001-10000)'},
  ];
  const navigation = useNavigation();

  const {location} = useSelector(state => state.Header);

  const renderLocationHeader = () => (
    <View style={styles.locationSection}>
      <View style={styles.locationRow}>
        <View style={styles.locationLeft}>
          <LocationIcon color="red" height={24} width={24} />
          <Text
            style={styles.locationText}
            numberOfLines={1}
            ellipsizeMode="tail">
            {location?.address}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SelectLocation');
          }}>
          <Text style={styles.changeText}>Change</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOptions = () => (
    <View style={styles.optionsContainer}>
      {tyreOptions.map(option => {
        const isSelected = selectedTyreType === option.id;
        return (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionItem, isSelected && styles.selectedOption]}
            onPress={() => {
              setSelectedTyreType(option.id);
              navigation.navigate('OrderDetailsCheckout', {
                category: 'Aggregate',
              });
            }}>
            <View style={styles.optionContent}>
              <View style={styles.optionMain}>
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.selectedText,
                  ]}>
                  {option.label}
                </Text>
              </View>
              <ChevronRightIcon />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Select Tyre Type"
      subTitle={selectedAggregate}
      showBack={false}
      locationSection={renderLocationHeader()}>
      {renderOptions()}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  locationSection: {
    marginBottom: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    // width: '95%',
    backgroundColor: '#E5E7EB',
    height: 60,
    alignContent: 'center',
    // alignItems: 'center',
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  locationIcon: {
    fontSize: 16,
    // marginRight: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    flexShrink: 1,
    overflow: 'hidden',
  },
  changeText: {
    fontSize: 16,
    color: '#159396',
  },

  optionsContainer: {gap: 12},
  optionItem: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fff',
  },
  selectedOption: {
    borderColor: '#159396',
    backgroundColor: '#f8fdfd',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionMain: {flex: 1},
  optionLabel: {fontSize: 16, fontWeight: '500', color: '#333'},
  selectedText: {color: '#159396'},
});

export default AggregateFlow;
