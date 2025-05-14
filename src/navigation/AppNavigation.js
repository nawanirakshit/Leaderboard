import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {ScreenNavigation} from '../utils/Constants';
import GameName from '../screen/GameName';
import {COLORS} from '../utils/Colors';
import {Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import Participant from '../screen/Participants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Scoreboard from '../screen/Score';
import UpdateScore from '../screen/UpdateScore';

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={ScreenNavigation.gamename}
      screenOptions={{
        gestureEnabled: true,
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
      }}>
      <Stack.Screen
        name={ScreenNavigation.gamename}
        component={GameName}
        options={({navigation}) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.headerColor,
            // height: 80,
          },
          headerTitle: () => (
            <Text style={{fontWeight: '600', fontSize: 18, color: 'white'}}>
              Leaderboard
            </Text>
          ),
        })}
      />

      <Stack.Screen
        name={ScreenNavigation.participant}
        component={Participant}
        options={({navigation}) => ({
          headerShown: false,
          headerStyle: {
            backgroundColor: COLORS.headerColor,
            // height: 80,
          },
          headerTitle: () => (
            <Text style={{fontWeight: '600', fontSize: 18, color: 'white'}}>
              Enter Participants
            </Text>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{paddingHorizontal: 16}}>
              {Platform.OS === 'android' ? (
                <MaterialIcons name="arrow-back" size={24} color="white" />
              ) : (
                <MaterialIcons name="chevron-left" size={26} color="white" />
              )}
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name={ScreenNavigation.score}
        component={Scoreboard}
        options={({navigation}) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.headerColor,
            // height: 80,
          },
          headerTitle: () => (
            <Text style={{fontWeight: '600', fontSize: 18, color: 'white'}}>
              Scoreboard
            </Text>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default AppNavigation;
