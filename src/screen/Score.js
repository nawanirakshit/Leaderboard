import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import GlobalStyles from '../utils/GlobalStyle';
import {useRoute} from '@react-navigation/native';

import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TouchableHighlight,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {alertMessage, showInfoToast} from '../utils/Common';

const Scoreboard = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [participant, setParticip] = useState(route.params.participant);
  const {gameName} = route.params;

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedParticipant, setParticipant] = useState({
    id: Date.now().toString(),
    name: 'Rakshit',
    score: 0,
    eliminated: false,
  });

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleItemClick = item => {
    setParticipant(item);
    toggleModal();
  };

  const handleDataUpdate = () => {
    toggleModal();
    //Sorting list based on score
    const sorted = sortData(participant);
    setParticip(sorted);
  };

  const sortData = dataToSort => {
    return [...dataToSort].sort((a, b) => {
      if (parseInt(a.score, 10) < parseInt(b.score, 10)) {
        return 1;
      }
      if (parseInt(a.score, 10) > parseInt(b.score, 10)) {
        return -1;
      }
      return 0;
    });
  };

  //Item Participant on a list
  const Participant = ({item, onPress, index}) => (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
        }}>
        <Text
          style={[
            GlobalStyles.textLarge,
            {color: 'blue', fontSize: 25, width: '10%'},
          ]}>
          {index + 1}
        </Text>
        <Text
          style={[
            GlobalStyles.textMedium,
            {
              color: 'black',
              fontSize: 20,
              flex: 1,
              textDecorationLine: item.eliminated ? 'line-through' : 'none',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}>
          {item.name}
        </Text>

        <Text
          style={[
            GlobalStyles.textMedium,
            {
              color: 'red',
              fontSize: 20,
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              width: '10%',
            },
          ]}>
          {item.score}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[GlobalStyles.container]}>
      <View
        style={[
          GlobalStyles.listcard,
          GlobalStyles.textLarge,
          {
            flex: 0,
            marginTop: 10,
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        ]}>
        <Text style={GlobalStyles.textLarge}>{gameName}</Text>
      </View>

      <FlatList
        data={participant}
        // renderItem={renderItem}
        renderItem={({item, index}) => (
          <Participant
            item={item}
            onPress={() => handleItemClick(item)}
            index={index}
          />
        )}
        keyExtractor={item => item.id.toString()}
      />

      <UpdateScoreModal
        onClicked={handleDataUpdate}
        isModalVisible={isModalVisible}
        item={selectedParticipant}
        // isChecked ={isChecked}
        // onValueChange ={handleValueFromChild}
      />
    </View>
  );
};

//isChecked, onValueChange
const UpdateScoreModal = ({onClicked, isModalVisible, item}) => {
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    //updating the score
    setInputText(item.score);
  }, [item]);

  const updatePoints = value => {
    setInputText(parseInt(inputText, 10) + parseInt(value, 10));
  };

  return (
    <Modal
      style={{backgroundColor: '#ffffff', borderRadius: 12, padding: 10}}
      isVisible={isModalVisible}
      coverScreen={false}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text
          style={[
            GlobalStyles.textLarge,
            {
              fontSize: 20,
              marginTop: 20,
              marginBottom: 30,
            },
          ]}>
          Update Score
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 15,
          }}>
          <Text
            style={[
              GlobalStyles.textMedium,
              {
                color: 'black',
                fontSize: 20,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            {item.name}
          </Text>

          <View
            style={[
              GlobalStyles.textMedium,
              {
                fontSize: 20,
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                width: '30%',
                height: 40,
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 20,
                paddingHorizontal: 10,
                color: 'black',
              },
            ]}>
            <TextInput
              style={{width: '100%', textAlign: 'center'}}
              value={inputText?.toString()}
              onChangeText={text => setInputText(text)}
              autoCorrect={false}
              keyboardType="numeric"
              placeholder="0"
            />
          </View>
        </View>

        <BouncyCheckbox
          size={25}
          style={{marginTop: 10, marginStart: 10}}
          fillColor="red"
          unFillColor="#FFFFFF"
          text="Eliminated"
          iconStyle={{borderColor: 'red'}}
          innerIconStyle={{borderWidth: 2}}
          isChecked={item.eliminated}
          onPress={isChecked => {
            item.eliminated = isChecked;
          }}
        />

        <View style={{flexDirection: 'row', marginTop: 30}}>
          <TouchableOpacity onPress={() => updatePoints(-15)}>
            <Text style={GlobalStyles.score}>-15</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => updatePoints(-10)}>
            <Text style={GlobalStyles.score}>-10</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => updatePoints(-5)}>
            <Text style={GlobalStyles.score}>-5</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => updatePoints(-1)}>
            <Text style={GlobalStyles.score}>-1</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => updatePoints(1)}>
            <Text style={GlobalStyles.score}>+1</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => updatePoints(5)}>
            <Text style={GlobalStyles.score}>+5</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => updatePoints(10)}>
            <Text style={GlobalStyles.score}>+10</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => updatePoints(15)}>
            <Text style={GlobalStyles.score}>+15</Text>
          </TouchableOpacity>
        </View>

        <TouchableHighlight
          style={[
            GlobalStyles.submit,
            {width: '90%', borderRadius: 50, marginTop: 30},
          ]}
          onPress={() => {
            item.score = parseInt(inputText, 10);
            item.eliminated = false;
            onClicked(item);
          }}
          underlayColor="#333">
          <Text
            style={[
              GlobalStyles.textMedium,
              {textAlign: 'center', color: '#fff', padding: 2},
            ]}>
            Update
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={[
            GlobalStyles.submit,
            {width: '90%', borderRadius: 50, marginTop: 10},
          ]}
          onPress={() => {
            onClicked(item);
          }}
          underlayColor="#333">
          <Text
            style={[
              GlobalStyles.textMedium,
              {textAlign: 'center', color: '#fff', padding: 2},
            ]}>
            Dismiss
          </Text>
        </TouchableHighlight>
      </View>
    </Modal>
  );
};

export default Scoreboard;
