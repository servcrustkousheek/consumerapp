import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signIn, signUp, confirmSignIn, getCurrentUser } from 'aws-amplify/auth';
import 'react-native-get-random-values';

// Constants for rate limiting
const OTP_RATE_LIMIT_KEY = 'OTP_RATE_LIMIT';
const MAX_OTP_REQUESTS = 3;
const RATE_LIMIT_DURATION = 15 * 60 * 1000; // 15 minutes
const LOGIN_RATE_LIMIT_KEY = 'LOGIN_RATE_LIMIT';
const LOGIN_RATE_LIMIT_DURATION = 5 * 60 * 1000; // 5 minutes

// Generate secure password for user signup
const generateSecurePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 16; i++) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    password += chars[array[0] % chars.length];
  }
  return password;
};

// Phone number validation for Indian numbers
const isValidIndianPhoneNumber = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
  return phoneRegex.test(cleanPhone);
};

// Normalize phone number to +91 format
const normalizePhoneNumber = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 10) {
    return `+91${cleanPhone}`;
  } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
    return `+${cleanPhone}`;
  } else if (cleanPhone.length === 13 && cleanPhone.startsWith('+91')) {
    return cleanPhone;
  }
  return `+91${cleanPhone}`;
};

const initialState = {
  isAuthenticated: false,
  user: null,
  phoneNumber: null,
  loading: false,
  error: null,
  session: null,
  resendTimer: 0,
  resendAttempts: 1,
  canResend: false,
  shouldNavigateToOTP: false,
  otpRateLimit: {
    count: 0,
    timestamp: null,
  },
  loginRateLimit: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setPhoneNumber: (state, action) => {
      state.phoneNumber = action.payload;
    },
    setSession: (state, action) => {
      state.session = action.payload;
      state.shouldNavigateToOTP = true;
    },
    setResendTimer: (state, action) => {
      state.resendTimer = action.payload;
      state.canResend = action.payload === 0;
    },
    decrementTimer: (state) => {
      if (state.resendTimer > 0) {
        state.resendTimer -= 1;
        state.canResend = state.resendTimer === 0;
      }
    },
    setResendAttempts: (state, action) => {
      state.resendAttempts = action.payload;
    },
    setOtpRateLimit: (state, action) => {
      state.otpRateLimit = action.payload;
    },
    setLoginRateLimit: (state, action) => {
      state.loginRateLimit = action.payload;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.phoneNumber = action.payload.phoneNumber;
      state.loading = false;
      state.error = null;
      state.session = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.phoneNumber = null;
      state.loading = false;
      state.error = null;
      state.session = null;
      state.resendTimer = 0;
      state.resendAttempts = 1;
      state.canResend = false;
      state.shouldNavigateToOTP = false;
    },
    clearNavigationFlag: (state) => {
      state.shouldNavigateToOTP = false;
    },
    resetAuthFlow: (state) => {
      state.session = null;
      state.resendTimer = 0;
      state.resendAttempts = 1;
      state.error = null;
      state.loading = false;
      state.canResend = false;
      state.shouldNavigateToOTP = false;
    },
  },
});

// Export action creators
export const {
  setLoading,
  stopLoading,
  setError,
  clearError,
  setPhoneNumber,
  setSession,
  setResendTimer,
  decrementTimer,
  setResendAttempts,
  setOtpRateLimit,
  setLoginRateLimit,
  loginSuccess,
  logout,
  resetAuthFlow,
  clearNavigationFlag,
} = authSlice.actions;

// Rate limiting helper functions
const loadOtpRateLimit = async () => {
  try {
    const storedRateLimit = await AsyncStorage.getItem(OTP_RATE_LIMIT_KEY);
    return storedRateLimit ? JSON.parse(storedRateLimit) : { count: 0, timestamp: null };
  } catch (error) {
    console.error('Error loading OTP rate limit:', error);
    return { count: 0, timestamp: null };
  }
};

const updateOtpRateLimit = async (dispatch, currentRateLimit) => {
  const currentTime = Date.now();
  let newCount = currentRateLimit.count;
  let newTimestamp = currentRateLimit.timestamp;

  if (!newTimestamp || currentTime - newTimestamp > RATE_LIMIT_DURATION) {
    newCount = 1;
    newTimestamp = currentTime;
  } else {
    newCount += 1;
  }

  const newRateLimit = { count: newCount, timestamp: newTimestamp };
  dispatch(setOtpRateLimit(newRateLimit));

  try {
    await AsyncStorage.setItem(OTP_RATE_LIMIT_KEY, JSON.stringify(newRateLimit));
  } catch (error) {
    console.error('Error saving OTP rate limit:', error);
  }

  return newRateLimit;
};

const isOtpRateLimited = (otpRateLimit) => {
  const currentTime = Date.now();
  return (
    otpRateLimit.count >= MAX_OTP_REQUESTS &&
    currentTime - otpRateLimit.timestamp <= RATE_LIMIT_DURATION
  );
};

// Extract error message from Lambda validation exception
const extractErrorMessage = (message) => {
  const match = message.match(/error (.+)/i);
  return match ? match[1] : message;
};

// Helper function to handle user signup
const handleUserSignUp = async (phoneNumber) => {
  const password = generateSecurePassword();
  
  try {
    const result = await signUp({
      username: phoneNumber,
      password: password,
      options: {
        userAttributes: {
          phone_number: phoneNumber,
          'custom:role': 'Customer',
        },
      },
    });

    console.log('SignUp successful for new user:', phoneNumber);
    
    // Save first login status
    await AsyncStorage.setItem('FIRSTLOGIN', 'false');
    await AsyncStorage.setItem('@user_status', 'new_user');
    
    return result;
    
  } catch (signUpError) {
    console.error('Error during sign up:', signUpError);
    throw new Error(signUpError.message || 'Failed to create account');
  }
};

// Main function to send OTP (handles both new and existing users)
export const sendOTP = (phoneNumber) => async (dispatch, getState) => {
  try {
    console.log('Starting authentication process for:', phoneNumber);
    
    // Validate phone number
    if (!isValidIndianPhoneNumber(phoneNumber)) {
      throw new Error('Please enter a valid Indian phone number');
    }

    dispatch(setLoading(true));
    dispatch(clearError());

    // Load and check rate limits
    const currentOtpRateLimit = await loadOtpRateLimit();
    dispatch(setOtpRateLimit(currentOtpRateLimit));

    // Check if rate limited
    if (isOtpRateLimited(currentOtpRateLimit)) {
      const remainingTime = Math.ceil((RATE_LIMIT_DURATION - (Date.now() - currentOtpRateLimit.timestamp)) / 60000);
      throw new Error(`Too many OTP requests. Please try again in ${remainingTime} minutes.`);
    }

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    dispatch(setPhoneNumber(normalizedPhone));

    console.log('Attempting to sign in with:', normalizedPhone);

    try {
      // Attempt to sign in with custom authentication flow
      const result = await signIn({
        username: normalizedPhone,
        options: {
          authFlowType: 'CUSTOM_WITHOUT_SRP'
        }
      });

      console.log('SignIn result:', JSON.stringify(result, null, 2));

      if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE') {
        console.log('✅ Custom challenge initiated - OTP sent');
        
        // Store session information
        dispatch(setSession(result));
        
        // Update rate limit
        await updateOtpRateLimit(dispatch, currentOtpRateLimit);

        // Set resend timer (30 seconds initially)
        dispatch(setResendTimer(30));
        dispatch(setResendAttempts(1));

        dispatch(stopLoading());
        return { success: true, message: 'OTP sent successfully', isNewUser: false };

      } else {
        console.warn('Unexpected sign-in step:', result.nextStep?.signInStep);
        throw new Error('Unexpected authentication response');
      }

    } catch (signInError) {
      console.error('Sign in error:', signInError);

      if (signInError.name === 'UserNotFoundException') {
        console.log('👤 User not found - Creating new user account');
        
        // Create new user account
        await handleUserSignUp(normalizedPhone);
        
        // Now attempt to sign in the newly created user
        console.log('🔄 Retrying sign in for new user');
        
        const retryResult = await signIn({
          username: normalizedPhone,
          options: {
            authFlowType: 'CUSTOM_WITHOUT_SRP'
          }
        });

        if (retryResult.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE') {
          console.log('✅ New user custom challenge initiated - OTP sent');
          
          dispatch(setSession(retryResult));
          await updateOtpRateLimit(dispatch, currentOtpRateLimit);
          dispatch(setResendTimer(30));
          dispatch(setResendAttempts(1));
          dispatch(stopLoading());
          
          return { success: true, message: 'Account created! OTP sent to verify your number.', isNewUser: true };
        } else {
          throw new Error('Failed to initiate verification for new user');
        }
        
      } else if (signInError.name === 'UsernameExistsException') {
        console.log('🔄 Username exists, retrying sign in');
        return await dispatch(sendOTP(normalizedPhone));
        
      } else if (signInError.name === 'UserLambdaValidationException') {
        const friendlyMessage = extractErrorMessage(signInError.message);
        throw new Error(friendlyMessage);
        
      } else {
        throw new Error(signInError.message || 'Failed to send OTP');
      }
    }

  } catch (error) {
    console.error('SendOTP error:', error);
    dispatch(setError(error.message || 'Failed to send OTP'));
    return { success: false, error: error.message };
  }
};

// Verify OTP function - UPDATED FOR 6 DIGITS
export const verifyOTP = (phoneNumber, otp) => async (dispatch, getState) => {
  try {
    console.log('🔐 Starting OTP verification for:', phoneNumber);

    if (otp.length !== 6) { // CHANGED FROM 5 TO 6
      throw new Error('OTP must be 6 digits long'); // UPDATED ERROR MESSAGE
    }

    dispatch(setLoading(true));
    dispatch(clearError());

    // Access the Auth state (uppercase A to match your rootReducer)
    const { session } = getState().Auth;
    
    if (!session) {
      throw new Error('No active session. Please request OTP again.');
    }

    console.log('📲 Confirming sign in with OTP');

    try {
      const result = await confirmSignIn({
        challengeResponse: otp,
      });

      console.log('ConfirmSignIn result:', JSON.stringify(result, null, 2));

      if (result.isSignedIn) {
        console.log('✅ Authentication successful!');
        
        // Get current user details
        const currentUser = await getCurrentUser();
        console.log('Current user:', currentUser);

        const userData = {
          user: {
            id: currentUser.userId,
            username: currentUser.username,
            phoneNumber: phoneNumber,
          },
          phoneNumber: phoneNumber,
        };

        // Save user data
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        await AsyncStorage.setItem('userToken', 'authenticated');

        dispatch(loginSuccess(userData));
        return { success: true };

      } else if (result.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE') {
        // OTP incorrect, more attempts allowed
        console.log('❌ OTP incorrect, more attempts allowed');
        throw new Error('Incorrect OTP. Please try again.');

      } else {
        console.log('Unexpected confirmation response');
        throw new Error('Unexpected authentication response');
      }

    } catch (confirmError) {
      console.error('OTP verification error:', confirmError);
      
      if (confirmError.name === 'NotAuthorizedException') {
        console.log('🚫 Max attempts exceeded');
        dispatch(resetAuthFlow());
        throw new Error('Maximum attempts exceeded. Please request a new OTP.');
      } else {
        throw new Error(confirmError.message || 'Invalid OTP');
      }
    }

  } catch (error) {
    console.error('VerifyOTP error:', error);
    dispatch(setError(error.message || 'Invalid OTP'));
    return { success: false, error: error.message };
  }
};

// Resend OTP function
export const resendOTP = (phoneNumber) => async (dispatch, getState) => {
  try {
    console.log('🔄 Resending OTP for:', phoneNumber);

    // Access the Auth state (uppercase A to match your rootReducer)
    const { otpRateLimit } = getState().Auth;
    
    if (isOtpRateLimited(otpRateLimit)) {
      const remainingTime = Math.ceil((RATE_LIMIT_DURATION - (Date.now() - otpRateLimit.timestamp)) / 60000);
      throw new Error(`Too many OTP requests. Please try again in ${remainingTime} minutes.`);
    }

    // Clear current session and resend
    dispatch(resetAuthFlow());
    
    const result = await dispatch(sendOTP(phoneNumber));
    
    if (result.success) {
      // Increase resend timer for subsequent attempts
      // Access the Auth state (uppercase A to match your rootReducer)
      const currentAttempts = getState().Auth.resendAttempts || 1;
      dispatch(setResendTimer(currentAttempts * 30)); // 30s, 60s, 90s...
      dispatch(setResendAttempts(currentAttempts + 1));
      
      return { success: true, message: 'OTP resent successfully' };
    } else {
      throw new Error(result.error || 'Failed to resend OTP');
    }

  } catch (error) {
    console.error('ResendOTP error:', error);
    dispatch(setError(error.message || 'Failed to resend OTP'));
    return { success: false, error: error.message };
  }
};

// Check authentication state on app start
export const checkAuthState = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Initialize default state values
    dispatch(setResendAttempts(1));
    dispatch(setResendTimer(0));
    
    // Load rate limits
    const otpRateLimit = await loadOtpRateLimit();
    dispatch(setOtpRateLimit(otpRateLimit));
    
    // Check for existing session
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    
    if (token && userData) {
      try {
        // Verify with Amplify
        const currentUser = await getCurrentUser();
        const parsedUserData = JSON.parse(userData);
        
        console.log('✅ Existing session found, user authenticated');
        dispatch(loginSuccess(parsedUserData));
      } catch (authError) {
        console.log('❌ Invalid session found, clearing data');
        // Clear invalid data
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
      }
    }
    
    dispatch(stopLoading());
  } catch (error) {
    console.error('Error checking auth state:', error);
    dispatch(stopLoading());
  }
};

// Logout function
export const logoutUser = () => async (dispatch) => {
  try {
    // Clear local storage
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('SESSION_ID');
    await AsyncStorage.removeItem('@user_status');
    
    dispatch(logout());
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, error: error.message };
  }
};

export default authSlice.reducer;