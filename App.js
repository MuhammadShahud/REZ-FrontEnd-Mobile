import { NavigationContainer } from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import React from 'react';
import { LogBox } from 'react-native';
import { Provider } from 'react-redux';
import AppNavigation from './src/Navigation/';
import { store, persistor } from './src/Store/store';
import { Settings } from 'react-native-fbsdk-next';

LogBox.ignoreAllLogs(true);
Settings.initializeSDK();

export default () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};
