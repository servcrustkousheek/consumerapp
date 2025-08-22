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
import { verifyOTP, sendOTP, clearError } from '../../redux/slices/AuthSlice';

const OTPVerification = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.Auth);
  const { phoneNumber } = route.params || {};

  useEffect(() => {
    startTimer();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const startTimer = () => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next input
    if (text && index < 4) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length === 5) {
      const result = await dispatch(verifyOTP(phoneNumber, otpCode));
      
      if (result.success) {
        // Navigate directly to footer screen
        navigation.navigate('footer');
      }
    } else {
      Alert.alert('Error', 'Please enter complete OTP');
    }
  };

  const handleResendCode = async () => {
    if (canResend) {
      setTimer(30);
      setCanResend(false);
      setOtp(['', '', '', '', '']);
      inputs.current[0].focus();
      
      const result = await dispatch(sendOTP(phoneNumber));
      
      if (result.success) {
        startTimer();
      }
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

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
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
         
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.subtitle}>
          We sent a 5-digit code to {phoneNumber}
        </Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => inputs.current[index] = ref}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled
              ]}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              editable={!loading}
            />
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            (!isOtpComplete || loading) && styles.verifyButtonDisabled
          ]}
          onPress={handleVerifyOtp}
          disabled={!isOtpComplete || loading}
        >
          <Text style={[
            styles.verifyButtonText,
            (!isOtpComplete || loading) && styles.verifyButtonTextDisabled
          ]}>
            {loading ? 'Verifying...' : 'Verify Number'}
          </Text>
        </TouchableOpacity>

        {/* Resend Code */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Did not receive the code?</Text>
          <TouchableOpacity 
            onPress={handleResendCode} 
            disabled={!canResend || loading}
          >
            <Text style={[
              styles.resendLink,
              (!canResend || loading) && styles.resendLinkDisabled
            ]}>
              {canResend && !loading ? 'Resend code' : `Resend code in ${timer}s`}
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
    backgroundColor: COLORS.white,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    fontSize: 20,
    fontWeight: '600',
    color: C100,
  },
  otpInputFilled: {
    borderColor: BRANDCOLOR,
    backgroundColor: '#F0F9FF',
  },
  verifyButton: {
    backgroundColor: BRANDCOLOR,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 32,
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
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  resendLink: {
    fontSize: 14,
    color: BRANDCOLOR,
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: '#999',
  },
});

export default OTPVerification;