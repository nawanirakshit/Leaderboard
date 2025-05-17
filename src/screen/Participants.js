import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  getDatabase,
  ref,
  onValue,
  update,
} from '@react-native-firebase/database';
import {getAuth} from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ScreenNavigation} from '../utils/Constants';

const Participant = () => {
  const route = useRoute();
  const {gameName} = route.params;
  const navigation = useNavigation();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerScore, setNewPlayerScore] = useState('');
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);

  useLayoutEffect(() => {
    const checkAndStartGame = () => {
      if (players.length >= 2) {
        navigation?.navigate(ScreenNavigation.score, {
          participant: players,
          gameName: gameName,
        });
      } else {
        Alert.alert(
          'Not Enough Players',
          `"${gameName}" needs at least 2 participants to start. Currently has ${players.length}.`,
        );
      }
    };

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={checkAndStartGame}
          style={{marginRight: 15}}
          disabled={loading || isDeleting}>
          {loading || isDeleting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <MaterialIcons name="play-circle-outline" size={28} color="#fff" /> // Play icon
          )}
        </TouchableOpacity>
      ),

      headerStyle: {
        backgroundColor: '#6200EE',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, players, gameName, loading, isDeleting]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && gameName) {
      const db = getDatabase();
      const gameDataRef = ref(db, `/${user.uid}/${gameName}`);

      const unsubscribe = onValue(
        gameDataRef,
        snapshot => {
          const data = snapshot.val();
          if (data && Array.isArray(data)) {
            const playersWithTempIds = data.map((player, index) => ({
              ...player,
              id: `${player.name}-${player.score}-${index}`,
            }));
            setPlayers(playersWithTempIds);
          } else {
            setPlayers([]);
          }
          setLoading(false);
        },
        error => {
          console.error(`Error fetching data for ${gameName}:`, error);
          Alert.alert(
            'Error',
            `Failed to load ${gameName} data: ` + error.message,
          );
          setLoading(false);
        },
      );

      return () => unsubscribe();
    } else {
      setLoading(false);
      if (!user) {
        Alert.alert(
          'Authentication Required',
          'Please sign in to view game details.',
        );
      } else {
        Alert.alert('Invalid Game', 'No game name provided.');
      }
    }
  }, [gameName]);

  // Function to remove a participant
  const handleRemoveParticipant = async participantToRemoveTempId => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to remove this participant?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            setIsDeleting(true); // Start deletion loading
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
              const db = getDatabase();
              const updatedPlayers = players.filter(
                player => player.id !== participantToRemoveTempId,
              );

              try {
                // Update the entire array in Firebase
                await update(ref(db, `/${user.uid}/`), {
                  [gameName]: updatedPlayers.map(({id, ...rest}) => rest), // Remove id before saving
                });
              } catch (error) {
                console.error('Error removing participant:', error);
                Alert.alert(
                  'Error',
                  'Failed to remove participant: ' + error.message,
                );
              } finally {
                setIsDeleting(false);
              }
            } else {
              setIsDeleting(false);
              Alert.alert(
                'Authentication Required',
                'Please sign in to remove participants.',
              );
            }
          },
        },
      ],
    );
  };

  const renderPlayerItem = ({item}) => (
    <View style={styles.playerItem}>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerScore}>Score: {item.score}</Text>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveParticipant(item.id)}
        disabled={isDeleting}>
        {isDeleting ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <MaterialIcons name="delete-forever" size={20} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading {gameName} details...</Text>
      </View>
    );
  }

  const handleAddParticipant = async () => {
    if (newPlayerName.trim() === '') {
      Alert.alert('Input Required', 'Please enter participant name.');
      return;
    }
    const score = parseInt(newPlayerScore, 10);
    if (isNaN(score) && newPlayerScore.trim() !== '') {
      Alert.alert('Invalid Score', 'Score must be a number.');
      return;
    }

    setIsAddingPlayer(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getDatabase();
      const gameDataRef = ref(db, `/${user.uid}/${gameName}`);

      // Create a new participant object
      const newParticipant = {
        name: newPlayerName.trim(),
        score: isNaN(score) ? 0 : score,
        eleminated: false,
      };

      // Create a new array including the new participant
      const updatedPlayers = [
        ...players.map(({id, ...rest}) => rest),
        newParticipant,
      ];

      try {
        await update(ref(db, `/${user.uid}/`), {
          [gameName]: updatedPlayers,
        });
        setNewPlayerName(''); // Clear input fields
        setNewPlayerScore('');
      } catch (error) {
        console.error('Error adding participant:', error);
        Alert.alert('Error', `Failed to add participant: ${error.message}`);
      } finally {
        setIsAddingPlayer(false);
      }
    } else {
      setIsAddingPlayer(false);
      Alert.alert(
        'Authentication Required',
        'Please sign in to add participants.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Players for {gameName}</Text>
      {players.length > 0 ? (
        <FlatList
          data={players}
          renderItem={renderPlayerItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.noPlayersContainer}>
          <Text style={styles.noPlayersText}>
            No players recorded for {gameName}.
          </Text>
        </View>
      )}

      <View style={styles.addParticipantSection}>
        <Text style={styles.addParticipantHeader}>Add New Participant</Text>
        <TextInput
          style={styles.input}
          placeholder="Participant Name"
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Score (Optional)"
          value={newPlayerScore}
          onChangeText={setNewPlayerScore}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.addParticipantButton}
          onPress={handleAddParticipant}
          disabled={isAddingPlayer || isDeleting || loading} // Disable during any operation
        >
          {isAddingPlayer ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addParticipantButtonText}>Add Participant</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  playerItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 7,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute space between player info and button
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  playerInfo: {
    flex: 1, // Take up available space
    marginRight: 10, // Space between info and button
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  playerScore: {
    fontSize: 16,
    color: '#666',
  },
  removeButton: {
    backgroundColor: '#dc3545', // Red color for delete
    padding: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  noPlayersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noPlayersText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
  },
  addParticipantSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: -2 },
    // shadowOpacity: 0.05,
    // shadowRadius: 3,
    // elevation: 5, // For Android shadow
  },
  addParticipantHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    fontSize: 16,
  },
  addParticipantButton: {
    backgroundColor: '#007bff', // Blue color
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  addParticipantButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Participant;
