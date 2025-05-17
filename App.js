import React from 'react';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigation from './src/navigation/AppNavigation';
import {AuthProvider} from './src/utils/AuthContex';
import MainNavigator from './src/navigation/MainNavigation';
import {LoadingProvider} from './src/utils/loading/LoadingContext';
import LoadingOverlay from './src/utils/loading/LoadingOverlay';

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <LoadingProvider>
          <AuthProvider>
            <NavigationContainer>
            <LoadingOverlay />
              <MainNavigator />
            </NavigationContainer>
          </AuthProvider>
        </LoadingProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
