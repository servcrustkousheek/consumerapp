import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import BottomSheet from '../../Components/BottomSheet';
import {ChevronRightIcon, LocationIcon} from '../../Utils/Icons';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const BricksFlow = ({visible, onClose, selectedBrick}) => {
  // State management for all selections
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedColorType, setSelectedColorType] = useState('');
  const [selectedBrandType, setSelectedBrandType] = useState('');
  const [selectedDimensions, setSelectedDimensions] = useState('');
  const [selectedTyreType, setSelectedTyreType] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const {location} = useSelector(state => state.Header);
  const navigation = useNavigation();
  // Step configuration (title only, no static subtitle here)
  const steps = [
    {
      title: 'Select Colour Type',
      options: [
        {id: 'kottanagar', label: 'Kottanagar', desc: 'Sun Dried Bricks'},
        {id: 'nalgonda', label: 'Nalgonda', desc: 'Burnt Clay Bricks'},
        {id: 'nizamabad', label: 'Nizamabad', desc: 'Fire Clay Bricks'},
      ],
    },
    {
      title: 'Select Brand Type',
      options: [
        {id: 'pvc', label: 'PVC'},
        {id: 'mirs', label: 'MIRS'},
        {id: 'vcs', label: 'VCS'},
      ],
    },
    {
      title: 'Select Dimensions',
      options: [
        {id: '9x3x4', label: '9 X 3 X 4'},
        {id: '3x6x5', label: '3 X 6 X 5'},
        {id: '7x8x9', label: '7 X 8 X 9'},
      ],
    },
    {
      title: 'Select Tyre Type',
      options: [
        {id: 'tractor-2000-3000', label: 'Tractor (2000-3000)', type: 'radio'},
        {id: '6-tyre-3001-6000', label: '6 Tyre (3001-6000)', type: 'radio'},
        {
          id: '10-tyre-6001-10000',
          label: '10 Tyre (6001-10000)',
          type: 'radio',
        },
      ],
    },
    {
      title: 'Enter Quantity',
      isQuantityStep: true,
      recommendedRange: 'Recommended range for Tractor: 1000-3000 pieces',
    },
  ];

  const currentStepData = steps[currentStep];

  // Helper to get option label by ID
  const getOptionLabel = (stepIndex, optionId) => {
    if (!optionId) return '';
    const option = steps[stepIndex]?.options?.find(opt => opt.id === optionId);
    return option ? option.label : '';
  };

  // Dynamic subtitle logic
  const getDynamicSubtitle = () => {
    if (currentStep === 0) {
      return ` ${selectedBrick}`; // from prop
    }
    switch (currentStep) {
      case 1:
        return ` ${getOptionLabel(0, selectedColorType)}`;
      case 2:
        return ` ${getOptionLabel(1, selectedBrandType)}`;
      case 3:
        return ` ${getOptionLabel(2, selectedDimensions)}`;
      case 4:
        return ` ${getOptionLabel(3, selectedTyreType)}`;
      default:
        return '';
    }
  };

  const handleOptionSelect = optionId => {
    switch (currentStep) {
      case 0:
        setSelectedColorType(optionId);
        break;
      case 1:
        setSelectedBrandType(optionId);
        break;
      case 2:
        setSelectedDimensions(optionId);
        break;
      case 3:
        setSelectedTyreType(optionId);
        break;
    }
    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const getCurrentSelection = () => {
    switch (currentStep) {
      case 0:
        return selectedColorType;
      case 1:
        return selectedBrandType;
      case 2:
        return selectedDimensions;
      case 3:
        return selectedTyreType;
      default:
        return '';
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleProceedToCheckout = () => {
    if (!selectedQuantity || selectedQuantity === '') {
      Alert.alert('Error', 'Please enter quantity');
      return;
    }
    const selections = {
      colorType: selectedColorType,
      brandType: selectedBrandType,
      dimensions: selectedDimensions,
      tyreType: selectedTyreType,
      quantity: selectedQuantity,
    };
    console.log('Final Selections:', selections);
    Alert.alert(
      'Success',
      `Proceeding to checkout with ${selectedQuantity} pieces`,
    );
    // onClose();
    navigation.navigate('OrderDetailsCheckout', {category: 'Bricks'});
  };

  const renderLocationSection = () => {
    if (currentStep !== 0) return null;

    return (
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
  };

  const renderOptions = () => {
    if (currentStepData.isQuantityStep) {
      return (
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Number of Units</Text>
          <TextInput
            style={styles.quantityInput}
            placeholder="Enter quantity (eg: 2500)"
            value={selectedQuantity}
            onChangeText={setSelectedQuantity}
            keyboardType="numeric"
          />
          <Text style={styles.recommendedText}>
            {currentStepData.recommendedRange}
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.changeTypeButton}>
              <Text style={styles.changeTypeText}>Change Tyre Type</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleProceedToCheckout}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.optionsContainer}>
        {currentStepData.options.map(option => {
          const isSelected = getCurrentSelection() === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionItem, isSelected && styles.selectedOption]}
              onPress={() => handleOptionSelect(option.id)}>
              <View style={styles.optionContent}>
                {option.type === 'radio' ? (
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioButton,
                        isSelected && styles.radioSelected,
                      ]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.selectedText,
                      ]}>
                      {option.label}
                    </Text>
                  </View>
                ) : (
                  <>
                    <View style={styles.optionMain}>
                      <Text
                        style={[
                          styles.optionLabel,
                          isSelected && styles.selectedText,
                        ]}>
                        {option.label}
                      </Text>
                      {option.desc && (
                        <Text style={styles.optionDesc}>{option.desc}</Text>
                      )}
                    </View>
                    <ChevronRightIcon />
                  </>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      onBack={handleBack}
      title={currentStepData?.title}
      subTitle={getDynamicSubtitle()} // dynamic
      showBack={currentStep > 0}
      locationSection={renderLocationSection()}>
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
    backgroundColor: '#E5E7EB',
    height: 60,
    justifyContent: 'center',
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationLeft: {
    flex: 1, // Allows it to grow, but leaves room for "Change"
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12, // Optional spacing from the Change button
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
  selectedOption: {borderColor: '#159396', backgroundColor: '#f8fdfd'},
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionMain: {flex: 1},
  optionLabel: {fontSize: 16, fontWeight: '500', color: '#333'},
  selectedText: {color: '#159396'},
  optionDesc: {fontSize: 14, color: '#666', marginTop: 4},
  arrow: {fontSize: 20, color: '#ccc'},
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {borderColor: '#159396'},
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#159396',
  },
  quantityContainer: {gap: 16},
  quantityLabel: {fontSize: 16, fontWeight: '500', color: '#333'},
  quantityInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  recommendedText: {fontSize: 14, color: '#666', textAlign: 'center'},
  buttonRow: {flexDirection: 'row', gap: 12, marginTop: 20},
  changeTypeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#159396',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  changeTypeText: {color: '#159396', fontSize: 16, fontWeight: '500'},
  checkoutButton: {
    flex: 1,
    backgroundColor: '#159396',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  checkoutText: {color: '#fff', fontSize: 16, fontWeight: '500'},
});

export default BricksFlow;
