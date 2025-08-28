import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Footer} from './index';
import SelectLocation from '../pages/Location/SelectLocation';
import OrderInfo from '../pages/Orders/OrderInfo';
import FeedbackPage from '../pages/Orders/FeedbackPage';
import OrderDetails from '../pages/Orders/OrderDetails';
import FilterOrders from '../pages/Orders/FilterOrders';
import CancelOrder from '../pages/Orders/CancelOrder';

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
        <Stack.Screen
          name="OrderInfo"
          component={OrderInfo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FeedbackPage"
          component={FeedbackPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="OrderDetails"
          component={OrderDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FilterOrders"
          component={FilterOrders}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CancelOrder"
          component={CancelOrder}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </>
  );
};

export default MainContainer;
