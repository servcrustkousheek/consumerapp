import {createSlice} from '@reduxjs/toolkit';
 
const initialState = {
  location: {
    address: 'Location Unavailable !',
    latitude: null,
    longitude: null,
    isServiceable: null,
  },
  notifications: [],
  notificationUnread: true,
};
 
const headerSlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    setLocation(state, action) {
      // action.payload should be an object: { address, latitude, longitude }
      state.location.address = action.payload.address;
      state.location.latitude = action.payload.latitude;
      state.location.longitude = action.payload.longitude;
      state.location.isServiceable = action.payload.isServiceable;
    },
    setNotificationUnread(state, action) {
      state.notificationUnread = action.payload;
    },
  },
});
 
export const {setLocation, setNotificationUnread} = headerSlice.actions;
 
export const setLocationData = data => async dispatch => {
  dispatch(setLocation(data));
};
export default headerSlice.reducer;