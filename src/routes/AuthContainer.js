import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../pages/LoginScreens/Login';
import OTPVerification from '../pages/LoginScreens/OTPVerification';

const Stack = createNativeStackNavigator();

const AuthContainer = () => {
  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={{
        contentStyle: { backgroundColor: '#fff' },
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen
        name="login"
        component={Login}
        options={{
          gestureEnabled: false, // Disable back gesture on login
        }}
      />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerification}
        options={{
          title: 'Verify OTP',
          gestureEnabled: true,
        }}
      />
      
    </Stack.Navigator>
  );
};

export default AuthContainer;