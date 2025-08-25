import React, { useState, useRef, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { BRANDCOLOR, COLORS, C100 } from '../../Utils/Colors';
import { verifyOTP, resendOTP, clearError, decrementTimer } from '../../redux/slices/AuthSlice';

const OTPVerification = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const inputs = useRef([]);
  
  const dispatch = useDispatch();
  const { 
    loading, 
    error, 
    resendTimer, 
    canResend,
    resendAttempts,
    isAuthenticated 
  } = useSelector(state => state.Auth);
  
  const { phoneNumber } = route.params || {};

  // Timer countdown effect
  useEffect(() => {
    let interval = null;
    
    if (resendTimer > 0) {
      interval = setInterval(() => {
        dispatch(decrementTimer());
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer, dispatch]);

  // Handle successful authentication
  useEffect(() => {
    if (isAuthenticated) {
      console.log('✅ Authentication successful, navigating to main app');
      navigation.reset({
        index: 0,
        routes: [{ name: 'footer' }],
      });
    }
  }, [isAuthenticated, navigation]);

  // Handle error display
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputs.current[0]) {
      setTimeout(() => {
        inputs.current[0].focus();
      }, 500);
    }
  }, []);

  const handleOtpChange = (text, index) => {
    // Only allow numeric input
    const numericText = text.replace(/[^0-9]/g, '');
    
    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);

    // Auto focus next input
    if (numericText && index < 4) {
      inputs.current[index + 1]?.focus();
    }
    
    // Auto submit when OTP is complete
    if (numericText && index === 4) {
      const completeOtp = [...newOtp];
      if (completeOtp.every(digit => digit !== '')) {
        setTimeout(() => {
          handleVerifyOtp(completeOtp.join(''));
        }, 100);
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // Move to previous input and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerifyOtp = async (otpCode = null) => {
    const otpToVerify = otpCode || otp.join('');
    
    if (otpToVerify.length !== 5) {
      Alert.alert('Error', 'Please enter complete 5-digit OTP');
      return;
    }

    console.log('🔐 Verifying OTP:', otpToVerify, 'for phone:', phoneNumber);
    
    const result = await dispatch(verifyOTP(phoneNumber, otpToVerify));
    
    if (!result.success) {
      console.log('❌ OTP verification failed, clearing inputs');
      // Clear OTP on error
      setOtp(['', '', '', '', '']);
      inputs.current[0]?.focus();
    }
    // Success navigation is handled by useEffect when isAuthenticated becomes true
  };

  const handleResendCode = async () => {
    if (!canResend || loading) {
      return;
    }

    console.log('🔄 Resending OTP for:', phoneNumber);
    
    // Clear current OTP
    setOtp(['', '', '', '', '']);
    inputs.current[0]?.focus();
    
    const result = await dispatch(resendOTP(phoneNumber));
    
    if (result.success) {
      Alert.alert('Success', 'OTP has been resent to your phone number');
    }
    // Error handling is done by Redux and useEffect
  };

  const handleGoBack = () => {
    if (loading) {
      return;
    }
    navigation.goBack();
  };

  const handleEditPhoneNumber = () => {
    if (loading) {
      return;
    }
    navigation.goBack();
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  // Format timer display
  const formatTimer = (seconds) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  };

  // Mask phone number for display (e.g., +91******3505)
  const maskPhoneNumber = (phone) => {
    if (phone && phone.length > 6) {
      const country = phone.substring(0, 3); // +91
      const lastFour = phone.slice(-4); // last 4 digits
      const masked = '******';
      return `${country}${masked}${lastFour}`;
    }
    return phone;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Verification Code</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            We sent a 5-digit code to{' '}
            <Text style={styles.phoneNumber}>{maskPhoneNumber(phoneNumber)}</Text>
          </Text>
          <TouchableOpacity 
            onPress={handleEditPhoneNumber}
            disabled={loading}
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => inputs.current[index] = ref}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
                loading && styles.otpInputDisabled
              ]}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              editable={!loading}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            (!isOtpComplete || loading) && styles.verifyButtonDisabled
          ]}
          onPress={() => handleVerifyOtp()}
          disabled={!isOtpComplete || loading}
        >
          <Text style={[
            styles.verifyButtonText,
            (!isOtpComplete || loading) && styles.verifyButtonTextDisabled
          ]}>
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </Text>
        </TouchableOpacity>

        {/* Resend Code Section */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity 
            onPress={handleResendCode} 
            disabled={!canResend || loading}
            style={styles.resendButton}
          >
            <Text style={[
              styles.resendLink,
              (!canResend || loading) && styles.resendLinkDisabled
            ]}>
              {canResend && !loading 
                ? 'Resend code' 
                : `Resend code in ${formatTimer(resendTimer)}`
              }
            </Text>
          </TouchableOpacity>
        </View>

        {/* Attempt indicator */}
        {resendAttempts > 1 && (
          <View style={styles.attemptContainer}>
            <Text style={styles.attemptText}>
              Resend attempt {resendAttempts - 1} of 3
            </Text>
          </View>
        )}

        {/* Help text */}
        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Having trouble? Check your network connection or contact support.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: BRANDCOLOR,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: C100,
    marginBottom: 12,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    flex: 1,
  },
  phoneNumber: {
    fontWeight: '600',
    color: C100,
  },
  editButton: {
    marginLeft: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: BRANDCOLOR,
    fontWeight: '600',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 55,
    height: 55,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '700',
    color: C100,
    backgroundColor: COLORS.white,
  },
  otpInputFilled: {
    borderColor: BRANDCOLOR,
    backgroundColor: '#F0F9FF',
  },
  otpInputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#999',
  },
  verifyButton: {
    backgroundColor: BRANDCOLOR,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: BRANDCOLOR,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  verifyButtonDisabled: {
    backgroundColor: '#E0E0E0',
    shadowOpacity: 0,
    elevation: 0,
  },
  verifyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  verifyButtonTextDisabled: {
    color: '#999',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendLink: {
    fontSize: 14,
    color: BRANDCOLOR,
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: '#999',
  },
  attemptContainer: {
    alignItems: 'center',
    paddingTop: 10,
    marginBottom: 20,
  },
  attemptText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  helpContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default OTPVerification;