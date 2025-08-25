import {combineReducers} from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/AuthSlice';
import {persistReducer} from 'redux-persist';
import headerReducer from './slices/HeaderSlice';

// ----------------------------------------------------------------------
export const rootPersistConfig = {
  key: 'root',
  storage: AsyncStorage,
  keyPrefix: 'redux-',
  whitelist: [],
};
export const AuthPersistConfig = {
  key: 'Auth',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  Auth: persistReducer(AuthPersistConfig, authReducer),
  Header: headerReducer,
});

export default rootReducer;
