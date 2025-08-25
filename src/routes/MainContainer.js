import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Footer} from './index';
import SelectLocation from '../pages/Location/SelectLocation';

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
          name="SelectLocation"
          component={SelectLocation}
          options={{headerShown: false}}
        />

       

    
      </Stack.Navigator>
    </>
  );
};

export default MainContainer;
