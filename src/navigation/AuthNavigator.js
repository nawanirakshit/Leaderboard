import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screen/prelogin/Login';
import RegistrationScreen from '../screen/prelogin/Registration';
import ForgotPasswordScreen from '../screen/prelogin/ForgotPassword';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="registration" component={RegistrationScreen} />
      <Stack.Screen name="forgot" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
