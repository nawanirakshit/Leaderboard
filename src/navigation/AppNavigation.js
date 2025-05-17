import React from 'react';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import {ScreenNavigation} from '../utils/Constants';
import GameName from '../screen/GameName';
import {COLORS} from '../utils/Colors';
import {Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProfileScreen from '../screen/Profile';
import PreviousGames from '../screen/PreviousGames';
import ParticipantUpdated from '../screen/Participants';
import ScoreboardUpdated from '../screen/ScorebaordUpdated';
import Participant from '../screen/Participants';
import Scoreboard from '../screen/ScorebaordUpdated';

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName={ScreenNavigation.previousgames}
      screenOptions={{
        gestureEnabled: true,
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
      }}>
      <Stack.Screen
        name={ScreenNavigation.previousgames}
        component={PreviousGames}
        options={({navigation}) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.headerColor,
            // height: 80,
          },
          headerTitle: () => (
            <Text style={{fontWeight: '600', fontSize: 18, color: 'white'}}>
              Previous Games
            </Text>
          ),
        })}
      />

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
              Add Games
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
        name={ScreenNavigation.participant}
        component={Participant}
        options={({navigation}) => ({
          headerShown: true,
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
        name={ScreenNavigation.profile}
        component={ProfileScreen}
        options={({navigation}) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.headerColor,
            // height: 80,
          },
          headerTitle: () => (
            <Text style={{fontWeight: '600', fontSize: 18, color: 'white'}}>
              Profile
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
    </Stack.Navigator>
  );
};

export default AppNavigation;
