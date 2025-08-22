import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  isAuthenticated: false,
  user: null,
  phoneNumber: null,
  loading: false,
  error: null,
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
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.phoneNumber = action.payload.phoneNumber;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.phoneNumber = null;
      state.loading = false;
      state.error = null;
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
  loginSuccess,
  logout,
} = authSlice.actions;

// Async action creators
export const sendOTP = (phoneNumber) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    dispatch(setPhoneNumber(phoneNumber));
    
    // Simulate API call to send OTP
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would call your actual API
    // const response = await api.sendOTP(phoneNumber);
    
    dispatch(stopLoading());
    return { success: true };
  } catch (error) {
    dispatch(setError(error.message || 'Failed to send OTP'));
    return { success: false, error: error.message };
  }
};

export const verifyOTP = (phoneNumber, otp) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Simulate API call to verify OTP
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would call your actual API
    // const response = await api.verifyOTP(phoneNumber, otp);
    
    // For demo purposes, accept any 5-digit OTP
    if (otp.length === 5) {
      const userData = {
        user: {
          id: '1',
          name: 'User',
          phoneNumber: phoneNumber,
        },
        phoneNumber: phoneNumber,
      };
      
      // Save token to AsyncStorage
      await AsyncStorage.setItem('userToken', 'demo_token_123');
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      
      dispatch(loginSuccess(userData));
      return { success: true };
    } else {
      throw new Error('Invalid OTP');
    }
  } catch (error) {
    dispatch(setError(error.message || 'Invalid OTP'));
    return { success: false, error: error.message };
  }
};

export const checkAuthState = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    
    if (token && userData) {
      const parsedUserData = JSON.parse(userData);
      dispatch(loginSuccess(parsedUserData));
    }
    
    dispatch(stopLoading());
  } catch (error) {
    console.error('Error checking auth state:', error);
    dispatch(stopLoading());
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    dispatch(logout());
  } catch (error) {
    console.error('Error logging out:', error);
  }
};

export default authSlice.reducer;