import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {getDatabase, ref, onValue} from '@react-native-firebase/database';
import {getAuth} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {ScreenNavigation} from '../utils/Constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const GameListScreen = () => {
  const [gamesWithParticipants, setGamesWithParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  //Setting icon on top right for profile and add new game
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection: 'row', marginRight: 10}}>
          <TouchableOpacity
            style={{marginRight: 15}}
            onPress={() => {
              navigation?.navigate(ScreenNavigation.profile);
            }}>
            <MaterialIcons name="account-box" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginRight: 15}}
            onPress={() => {
              navigation?.navigate(ScreenNavigation.gamename);
            }}>
            <MaterialIcons name="plus-one" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  //Checking if games are already added or not by user
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getDatabase();
      const userGamesRef = ref(db, `/${user.uid}/`);

      const unsubscribe = onValue(
        userGamesRef,
        snapshot => {
          const data = snapshot.val();
          const loadedGames = [];

          if (data) {
            Object.keys(data).forEach(gameName => {
              const participants = data[gameName];
              let participantCount = 0;

              if (Array.isArray(participants)) {
                participantCount = participants.length;
              } else if (
                typeof participants === 'object' &&
                participants !== null
              ) {
                participantCount = Object.keys(participants).length;
              }

              loadedGames.push({
                name: gameName,
                participants: participantCount,
              });
            });
            setGamesWithParticipants(loadedGames);
          } else {
            setGamesWithParticipants([]);
          }
          setLoading(false);
        },
        error => {
          console.error('Error fetching game data with participants:', error);
          Alert.alert('Error', 'Failed to load games: ' + error.message);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    } else {
      setLoading(false);
      Alert.alert(
        'Authentication Required',
        'Please sign in to view your games.',
      );
    }
  }, []);

  //handing item click and navigating to Participant screen
  const handleGamePress = gameName => {
    navigation?.navigate(ScreenNavigation.participant, {
      gameName: gameName,
    });
  };

  //Navigating to add gmae screen
  const handleAddGamePress = () => {
    navigation.navigate(ScreenNavigation.gamename);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.gameItem}
      onPress={() => handleGamePress(item.name)}>
      <Text style={styles.gameName}>{item.name}</Text>
      <Text style={styles.participantCount}>
        Participants: {item.participants}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Games...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {gamesWithParticipants.length > 0 ? (
        <FlatList
          data={gamesWithParticipants}
          renderItem={renderItem}
          keyExtractor={item => item.name}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.noGamesContainer}>
          <Text style={styles.noGamesText}>No games added yet.</Text>
          <Text style={styles.noGamesSubText}>
            Click the button below to add your first game!
          </Text>
          <TouchableOpacity
            style={styles.addGameButton}
            onPress={handleAddGamePress}>
            <Text style={styles.addGameButtonText}>Add New Game</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 7,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'column', // To align name and count horizontally
    justifyContent: 'space-between',
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  participantCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  noGamesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noGamesText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  noGamesSubText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 30,
    textAlign: 'center',
  },
  addGameButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    shadowColor: '#28a745',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  addGameButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameListScreen;
