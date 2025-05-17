import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Constants } from './Constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem(Constants.storage_userToken);
      const userData = await AsyncStorage.getItem(Constants.storage_userData);

      if (userToken && userData) {
        setUser(JSON.parse(userData));
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      await AsyncStorage.setItem(Constants.storage_userToken, userData.token);
      await AsyncStorage.setItem(Constants.storage_userData, JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.log('Login error:', error);
      return false;
    }
  };


  const logout = async () => {
    try {
      await AsyncStorage.removeItem(Constants.storage_userToken);
      await AsyncStorage.removeItem(Constants.storage_userData);
      setUser(null);
      setIsLoggedIn(false);
      return true;
    } catch (error) {
      console.log('Logout error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isLoggedIn,
        user,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
