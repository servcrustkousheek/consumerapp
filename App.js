import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider, useDispatch} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PersistGate} from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import RootContainer from './src/routes/RootContainer';
import {persistor, store} from './src/redux/store';
import {Amplify} from 'aws-amplify';
import { amplifyConfig } from './amplifyconfiguration';
import {checkAuthState} from './src/redux/slices/AuthSlice';


Amplify.configure(amplifyConfig);

// Component to check auth state on app load
const AuthChecker = ({children}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already authenticated when app loads
    dispatch(checkAuthState());
  }, [dispatch]);

  return children;
};

const App = () => {
  return (
    <React.Fragment>
      <StatusBar backgroundColor={'#25786D'} barStyle="light-content" />

      <NavigationContainer>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SafeAreaProvider>
              <GestureHandlerRootView style={{flex: 1}}>
                <AuthChecker>
                  <RootContainer />
                </AuthChecker>
                <Toast />
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      </NavigationContainer>
    </React.Fragment>
  );
};

export default App;
