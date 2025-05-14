import {TouchableHighlight, Text, View, TextInput} from 'react-native';
import React from 'react';
import GlobalStyles from '../utils/GlobalStyle';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {ScreenNavigation} from '../utils/Constants';
import {showErrorToast} from '../utils/Common';

const GameName = () => {
  const [name, onChangName] = React.useState('');
  const navigation = useNavigation();

  return (
    <View style={[GlobalStyles.container, {justifyContent: 'center'}]}>
      <View style={[GlobalStyles.listcard, {justifyContent: 'center'}]}>
        <Text style={[GlobalStyles.textLarge]}>Enter Game name</Text>
        <TextInput
          style={GlobalStyles.input}
          onChangeText={onChangName}
          value={name}
          autoCorrect={false}
          placeholder="Enter game name here"
        />

        <TouchableHighlight
          style={[GlobalStyles.submit, {width: '90%', borderRadius: 50}]}
          onPress={() => {
            if (!name) {
                alert('Please enter game name to continue!');
            } else {
              navigation?.navigate(ScreenNavigation.participant, {
                gameName: name,
              });
            }
          }}
          underlayColor="#333">
          <Text
            style={[
              GlobalStyles.textMedium,
              {textAlign: 'center', color: '#fff', padding: 2},
            ]}>
            Continue
          </Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default GameName;
