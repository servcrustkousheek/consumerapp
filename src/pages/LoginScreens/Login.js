import React, { useState } from 'react';
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
  const { loading, error } = useSelector(state => state.Auth);

  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handlePhoneNumberChange = (text) => {
    // Remove any non-digit characters
    const cleanText = text.replace(/[^0-9]/g, '');
    setPhoneNumber(cleanText);
    setIsButtonDisabled(cleanText.length < 10);
  };

  const handleVerifyNumber = async () => {
    if (phoneNumber.length >= 10) {
      const fullPhoneNumber = `+91${phoneNumber}`;
      const result = await dispatch(sendOTP(fullPhoneNumber));
      
      if (result.success) {
        navigation.navigate('OTPVerification', { 
          phoneNumber: fullPhoneNumber 
        });
      }
    } else {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
    }
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
            <TextInput
              style={styles.phoneInput}
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              placeholder="Enter your mobile number"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={10}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.verifyButton,
              (isButtonDisabled || loading) && styles.verifyButtonDisabled
            ]}
            onPress={handleVerifyNumber}
            disabled={isButtonDisabled || loading}
          >
            <Text style={[
              styles.verifyButtonText,
              (isButtonDisabled || loading) && styles.verifyButtonTextDisabled
            ]}>
              {loading ? 'Sending OTP...' : 'Verify Number'}
            </Text>
          </TouchableOpacity>
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
  phoneInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    fontSize: 16,
    color: C100,
  },
  verifyButton: {
    backgroundColor: BRANDCOLOR,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  verifyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  verifyButtonTextDisabled: {
    color: '#999',
  },
});

export default Login;