import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './index';





const Stack = createNativeStackNavigator();

const AuthContainer = () => {
  return (
    <Stack.Navigator
      initialRouteName="login"
      screenOptions={{
        contentStyle: { backgroundColor: '#fff' },
        headerShown: false
      }}>
      <Stack.Screen
        name="login"
        component={Login}
      />
     
    </Stack.Navigator>
  );
};

export default AuthContainer;