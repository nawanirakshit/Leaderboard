import React, {useEffect, useState} from 'react';
import AppNavigation from './AppNavigation';
import SplashScreen from '../screen/prelogin/Splash';
import AuthNavigator from './AuthNavigator';
import { useAuth } from '../utils/AuthContex';

const MainNavigator = () => {
  const {isLoading, isLoggedIn} = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (isLoading) {
    return <SplashScreen />;
  }

  return isLoggedIn ? <AppNavigation /> : <AuthNavigator />;
};

export default MainNavigator;
