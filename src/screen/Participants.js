import {
  FlatList,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import GlobalStyles from '../utils/GlobalStyle';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ScreenNavigation} from '../utils/Constants';
import {COLORS} from '../utils/Colors';
import { showErrorToast } from '../utils/Common';

const Participant = ({route}) => {
  const navigation = useNavigation();

  const [name, onChangName] = useState('');

  const {gameName} = route.params;

  const [listData, setListData] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleToolbarClick = () => {
    if (listData.length > 1) {
      navigation?.navigate(ScreenNavigation.score, {
        participant: listData,
        gameName: gameName,
      });
    } else {
      Alert.alert('Error', 'Two participants are required to continue.');
    }
  };

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleAddItem = () => {
    if (inputText.trim()) {
      setListData([...listData, {id: Date.now().toString(), name: inputText, score: 0, eliminated: false}]);
      setInputText('');
    } else {
      alert('Please enter Participants name!');
    }
  };

  const handleDeleteItem = (itemId, itemName) => {
    const message = 'Are you sure you want to remove ${item.name}';
    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete "${itemName}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setListData(listData.filter(listItem => listItem.id !== itemId));
          },
        },
      ],
      {cancelable: false},
    );
  };

  const renderItem = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      }}>
      <Text>{item.name}</Text>
      <TouchableOpacity
        style={{padding: 8}}
        onPress={() => handleDeleteItem(item.id, item.text)}>
        <Text style={{color: 'red', fontSize: 18, fontWeight: 'bold'}}>x</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[GlobalStyles.container]}>
      <View
        style={{
          height: 100,
          paddingTop: 50,
          paddingStart: 10,
          paddingEnd: 10,
          backgroundColor: COLORS.headerColor,
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <TouchableOpacity
           onPress={() => {navigation.goBack()}}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {Platform.OS === 'android' ? (
            <MaterialIcons name="arrow-back" size={24} color="white" />
          ) : (
            <MaterialIcons name="chevron-left" size={26} color="white" />
          )}
        </TouchableOpacity>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Text style={[GlobalStyles.textLarge, {color: 'white'}]}>
            Participants
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleToolbarClick}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialIcons name="forward" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={[GlobalStyles.textLarge, {marginTop: 20, marginBottom: 10}]}>
        Add Participant name for {gameName}
      </Text>

      <View style={{flexDirection: 'row', alignItems: 'center', margin: 10}}>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            marginRight: 10,
          }}
          autoCorrect={false}
          placeholder="Enter Participants name"
          value={inputText}
          onChangeText={text => setInputText(text)}
        />
        <TouchableOpacity
          style={{backgroundColor: 'blue', padding: 10, borderRadius: 5}}
          onPress={handleAddItem}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={listData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={{flexGrow: 1, margin: 10}}
      />
    </View>
  );
};

export default Participant;
