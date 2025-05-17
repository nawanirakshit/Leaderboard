import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Dimensions,
} from 'react-native';

import {getApp, initializeApp} from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBJLPOgbyFpsDWIc2g-oLilOUgEGK9XGNw',
  authDomain: 'scrappingtesting.firebaseapp.com',
  projectId: 'scrappingtesting',
  storageBucket: 'scrappingtesting.firebasestorage.app',
  messagingSenderId: '344613626883',
  appId: '1:344613626883:web:6a96e47acaa47571ac9a36',
  measurementId: 'G-FRPCV8351R',
};

const SplashScreen = () => {
  initializeApp(firebaseConfig);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0066cc" barStyle="light-content" />
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>Leaderboard</Text>
      </View>
      <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0066cc',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 20,
    color: '#ffffff',
    letterSpacing: 8,
    marginTop: 5,
  },
  loader: {
    marginTop: 50,
  },
});

export default SplashScreen;
