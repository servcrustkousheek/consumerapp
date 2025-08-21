import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import {
  signUp,
  signIn,
  signOut,
  confirmSignIn,
  getCurrentUser,
  fetchUserAttributes,
  fetchAuthSession,
} from 'aws-amplify/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {OMS_URI_NOAUTH} from '../../../env-vars';
import {setCalenderEmpty, stopLoading} from './DashBoardSlice';
import {Alert} from 'react-native';

const initialState = {
  isAuthenticated: false,

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
    stopLoading: (state, action) => {
      state.loading = false;
    },
  },
});

// Export action creators
export const {
  setLoading,

  setError,
} = authSlice.actions;

// Enhanced validateUser with better error handling from Driver app

export default authSlice.reducer;
