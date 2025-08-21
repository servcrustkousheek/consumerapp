import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {PersistGate} from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';

import RootContainer from './src/routes/RootContainer';
import {persistor, store} from './src/redux/store';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

const App = () => {
  return (
    <React.Fragment>
      <StatusBar backgroundColor={'#128C7E'} barStyle="light-content" />
      <NavigationContainer>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SafeAreaProvider>
              <RootContainer />
              <Toast />
            </SafeAreaProvider>
          </PersistGate>
        </Provider>
      </NavigationContainer>
    </React.Fragment>
  );
};

export default App;
