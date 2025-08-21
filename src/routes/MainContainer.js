import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Footer} from './index';
import {Login} from './index';

const Stack = createNativeStackNavigator();

const MainContainer = () => {
  return (
    <>
      <Stack.Navigator
        initialRouteName="footer"
        screenOptions={{
          contentStyle: {backgroundColor: '#fff'},
          headerShown: false,
        }}>
        <Stack.Screen
          name="footer"
          component={Footer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="login"
          component={Login}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </>
  );
};

export default MainContainer;
