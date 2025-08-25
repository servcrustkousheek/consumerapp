import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import { BRANDCOLOR, COLORS, C100 } from '../../Utils/Colors';
import { SCREEN_WIDTH } from '../../Utils/Dimensions';
import { sendOTP, clearError } from '../../redux/slices/AuthSlice';

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  
  const dispatch = useDispatch();
  const { loading, error, session } = useSelector(state => state.Auth);

  // Handle error display
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Navigate to OTP screen when session is established
  useEffect(() => {
    if (session) {
      const fullPhoneNumber = phoneNumber.startsWith('+91') 
        ? phoneNumber 
        : `+91${phoneNumber}`;
      
      navigation.navigate('OTPVerification', { 
        phoneNumber: fullPhoneNumber 
      });
    }
  }, [session, phoneNumber, navigation]);

  // Validate Indian phone number
  const isValidIndianPhoneNumber = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const phoneRegex = /^[6-9]\d{9}$/; // 10-digit numbers starting with 6-9
    return phoneRegex.test(cleanPhone);
  };

  const handlePhoneNumberChange = (text) => {
    // Remove any non-digit characters
    const cleanText = text.replace(/[^0-9]/g, '');
    
    // Limit to 10 digits for Indian numbers
    const finalText = cleanText.slice(0, 10);
    setPhoneNumber(finalText);
    
    // Validate button state
    const isValid = finalText.length === 10 && isValidIndianPhoneNumber(finalText);
    setIsButtonDisabled(!isValid);
  };

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    // Final validation
    if (!isValidIndianPhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid Indian phone number (starting with 6, 7, 8, or 9)');
      return;
    }

    // Format phone number to +91 format
    const fullPhoneNumber = `+91${phoneNumber}`;
    
    console.log('🚀 Starting authentication for:', fullPhoneNumber);
    
    const result = await dispatch(sendOTP(fullPhoneNumber));
    
    if (result.success) {
      console.log('✅ OTP process initiated successfully');
      // Show success message based on user type
      if (result.isNewUser) {
        Alert.alert('Welcome!', result.message || 'Account created! Please verify your phone number.');
      }
      // Navigation to OTP screen is handled automatically by useEffect
    } else {
      console.error('❌ OTP send failed:', result.error);
      // Error is already handled by Redux and shown in useEffect
    }
  };

  // Check if phone number is valid and complete for showing checkmark
  const isPhoneNumberValid = () => {
    return phoneNumber.length === 10 && isValidIndianPhoneNumber(phoneNumber);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={BRANDCOLOR} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <SvgUri
          uri="https://d3b1cj4ht2fm8t.cloudfront.net/staging/marketing+and+sales+app/logo_vertical.svg"
          width={120}
          height={80}
        />
        <Text style={styles.appTitle}>ServCrust</Text>
        <Text style={styles.appSubtitle}>Consumer App</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Enter Mobile Number</Text>
          
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <View style={styles.phoneInputWrapper}>
              <TextInput
                style={styles.phoneInput}
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                placeholder="Enter your mobile number"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={10}
                editable={!loading}
                autoFocus={!loading}
              />
              {isPhoneNumberValid() && (
                <View style={styles.verifiedIcon}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.sendOTPButton,
              (isButtonDisabled || loading) && styles.sendOTPButtonDisabled
            ]}
            onPress={handleSendOTP}
            disabled={isButtonDisabled || loading}
          >
            <Text style={[
              styles.sendOTPButtonText,
              (isButtonDisabled || loading) && styles.sendOTPButtonTextDisabled
            ]}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </Text>
          </TouchableOpacity>

          {/* Info text */}
          <Text style={styles.infoText}>
            We'll send you a 5-digit verification code to verify your number
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRANDCOLOR,
  },
  header: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 20,
  },
  appSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.9,
    marginTop: 5,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  inputContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: C100,
    marginBottom: 24,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  countryCode: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    minWidth: 60,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '500',
    color: C100,
    textAlign: 'center',
  },
  phoneInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingRight: 16,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: C100,
  },
  verifiedIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sendOTPButton: {
    backgroundColor: BRANDCOLOR,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: BRANDCOLOR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  sendOTPButtonDisabled: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendOTPButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  sendOTPButtonTextDisabled: {
    color: '#999',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});

export default Login;