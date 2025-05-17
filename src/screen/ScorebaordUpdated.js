import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {
  getDatabase,
  ref,
  onValue,
  update,
} from '@react-native-firebase/database';
import {getAuth} from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Scoreboard = () => {
  const route = useRoute();
  const {gameName} = route.params;

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayerId, setEditingPlayerId] = useState(null);
  const [tempScore, setTempScore] = useState('');
  const [isUpdatingScore, setIsUpdatingScore] = useState(false);

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
          let loadedPlayers = [];

          if (data && Array.isArray(data)) {
            loadedPlayers = data.map((player, index) => ({
              ...player,
              _tempId: `${player.name}-${player.score}-${index}`,
            }));

            loadedPlayers.sort((a, b) => b.score - a.score);
          }
          setPlayers(loadedPlayers);
          setLoading(false);
        },
        error => {
          console.error(
            `Error fetching scoreboard data for ${gameName}:`,
            error,
          );
          Alert.alert('Error', `Failed to load scoreboard: ` + error.message);
          setLoading(false);
        },
      );

      return () => unsubscribe();
    } else {
      setLoading(false);
      Alert.alert(
        'Authentication Required',
        'Please sign in to view the scoreboard.',
      );
    }
  }, [gameName]);

  const handleScoreUpdate = async (playerIdToUpdate, newScoreString) => {
    const newScore = parseInt(newScoreString, 10);

    // Validate new score
    if (isNaN(newScore)) {
      Alert.alert(
        'Invalid Score',
        'Please enter a valid number for the score.',
      );
      return;
    }

    setIsUpdatingScore(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getDatabase();
      const playerIndex = players.findIndex(
        p => p._tempId === playerIdToUpdate,
      );

      if (playerIndex !== -1) {
        // Create a copy of the players array to modify
        const updatedPlayersArray = [...players];
        updatedPlayersArray[playerIndex] = {
          ...updatedPlayersArray[playerIndex],
          score: newScore,
        };

        // Filter out _tempId before sending to Firebase
        const playersForFirebase = updatedPlayersArray.map(
          ({_tempId, ...rest}) => rest,
        );

        try {
          // Update the entire array for this game in Firebase
          await update(ref(db, `/${user.uid}/`), {
            [gameName]: playersForFirebase,
          });
          // Firebase listener will automatically update the UI after successful write
          setEditingPlayerId(null); // Exit editing mode
          setTempScore(''); // Clear temp score
          // Alert.alert('Success', 'Score updated!'); // Could be annoying for frequent updates
        } catch (error) {
          console.error('Error updating score:', error);
          Alert.alert('Error', 'Failed to update score: ' + error.message);
        } finally {
          setIsUpdatingScore(false);
        }
      } else {
        setIsUpdatingScore(false);
        Alert.alert('Error', 'Player not found.');
      }
    } else {
      setIsUpdatingScore(false);
      Alert.alert(
        'Authentication Required',
        'Please sign in to update scores.',
      );
    }
  };

  const renderPlayerItem = ({item, index}) => {
    // Determine the rank of the player.
    const rank = index + 1;
    //highlight score only when score is >0
    const shouldHighlight = item.score > 0;

    // Conditionally apply styles based on rank.
    const itemStyles = [styles.playerItem];
    const rankTextStyles = [styles.rankText];
    const nameTextStyles = [styles.playerName];
    const scoreTextStyles = [styles.playerScore];

    if (shouldHighlight) {
      if (rank === 1) {
        itemStyles.push(styles.firstPlaceItem);
        rankTextStyles.push(styles.firstPlaceRankText);
        nameTextStyles.push(styles.firstPlaceName);
        scoreTextStyles.push(styles.firstPlaceScore);
      } else if (rank === 2) {
        itemStyles.push(styles.secondPlaceItem);
        rankTextStyles.push(styles.secondPlaceRankText);
        nameTextStyles.push(styles.secondPlaceName);
        scoreTextStyles.push(styles.secondPlaceScore);
      } else if (rank === 3) {
        itemStyles.push(styles.thirdPlaceItem);
        rankTextStyles.push(styles.thirdPlaceRankText);
        nameTextStyles.push(styles.thirdPlaceName);
        scoreTextStyles.push(styles.thirdPlaceScore);
      }
    }

    return (
      <View style={itemStyles}>
        <Text style={rankTextStyles}>{rank}.</Text>
        <View style={styles.playerInfo}>
          <Text style={nameTextStyles}>{item.name}</Text>
          {rank === 1 &&
            shouldHighlight && ( // Show trophy icon only for the first place
              <MaterialIcons
                name="goat"
                size={20}
                color="#H0H0H0"
                style={styles.leaderIcon}
              />
            )}
          {rank === 2 &&
            shouldHighlight && ( // Silver medal icon for second place
              <MaterialIcons
                name="bolt"
                size={20}
                color="#H0H0H0"
                style={styles.leaderIcon}
              />
            )}
          {rank === 3 &&
            shouldHighlight && ( // Bronze medal icon for third place
              <MaterialIcons
                name="ac-unit"
                size={20}
                color="#H0H0H0"
                style={styles.leaderIcon}
              />
            )}
        </View>

        {editingPlayerId === item._tempId ? (
          // Editing mode: TextInput and Save/Cancel buttons.
          <View style={styles.scoreEditContainer}>
            <TextInput
              style={styles.scoreInput}
              value={tempScore}
              onChangeText={setTempScore}
              keyboardType="numeric"
              maxLength={5}
              autoFocus={true}
              onSubmitEditing={() => handleScoreUpdate(item._tempId, tempScore)}
            />
            <TouchableOpacity
              style={styles.saveScoreButton}
              onPress={() => handleScoreUpdate(item._tempId, tempScore)}
              disabled={isUpdatingScore}>
              {isUpdatingScore ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <MaterialIcons name="check" size={20} color="#fff" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelScoreButton}
              onPress={() => setEditingPlayerId(null)}
              disabled={isUpdatingScore}>
              <MaterialIcons name="close" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          // Display mode: Score and Edit button.
          <View style={styles.scoreDisplayContainer}>
            <Text style={scoreTextStyles}>{item.score}</Text>
            <TouchableOpacity
              style={styles.editScoreButton}
              onPress={() => {
                setEditingPlayerId(item._tempId);
                setTempScore(String(item.score));
              }}
              disabled={isUpdatingScore}>
              <MaterialIcons name="edit" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Scoreboard...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView // For keyboard management
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      {players.length > 0 ? (
        <FlatList
          data={players}
          renderItem={renderPlayerItem}
          keyExtractor={item => item._tempId}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.noPlayersContainer}>
          <Text style={styles.noPlayersText}>No players in this game yet.</Text>
          <Text style={styles.noPlayersSubText}>
            Add participants from the previous screen!
          </Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa', // Light blue background for scoreboard
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b', // Dark teal for rank
    width: 30, // Fixed width for rank
    textAlign: 'center',
    marginRight: 10,
  },
  playerInfo: {
    flex: 1, // Take up remaining space
    marginRight: 10,
    flexDirection: 'row', // To align name and icon
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  playerScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff', // Blue for score
    marginLeft: 10,
  },
  listContent: {
    paddingVertical: 10,
    paddingBottom: 20,
  },
  noPlayersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noPlayersText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  noPlayersSubText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  // Score editing specific styles
  scoreDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editScoreButton: {
    backgroundColor: '#17a2b8', // Info blue for edit
    padding: 6,
    borderRadius: 5,
    marginLeft: 10,
  },
  scoreEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreInput: {
    width: 70, // Fixed width for score input
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
  saveScoreButton: {
    backgroundColor: '#28a745', // Green for save
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  cancelScoreButton: {
    backgroundColor: '#6c757d', // Grey for cancel
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  leaderItem: {
    backgroundColor: '#FFD700', // Gold background
    borderWidth: 2,
    borderColor: '#FFA500', // Orange border
    shadowColor: '#FFD700', // Gold shadow for a glow effect
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10, // More prominent shadow
  },
  leaderRankText: {
    color: '#8B4513', // Brown for rank text
  },
  leaderIcon: {
    marginLeft: 10, // Space between name and icon
  },
  leaderName: {
    color: '#8B4513', // Brown for leader name
    fontWeight: 'bold',
  },
  leaderScore: {
    color: '#8B4513', // Brown for leader score
    fontWeight: 'bold',
  },
  // --- First Place Styles (Gold) ---
  firstPlaceItem: {
    backgroundColor: '#FFD700', // Gold background
    borderWidth: 2,
    borderColor: '#DAA520', // Darker Gold border
    shadowColor: '#DAA520',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  firstPlaceRankText: {
    color: '#8B4513', // Brown color for text
  },
  firstPlaceName: {
    color: '#8B4513',
    fontWeight: 'bold',
  },
  firstPlaceScore: {
    color: '#8B4513',
    fontWeight: 'bold',
  },
  // --- Second Place Styles (Silver) ---
  secondPlaceItem: {
    backgroundColor: '#C0C0C0', // Silver background
    borderWidth: 2,
    borderColor: '#A9A9A9', // Darker Silver border
    shadowColor: '#A9A9A9',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  secondPlaceRankText: {
    color: '#36454F', // Charcoal color
  },
  secondPlaceName: {
    color: '#36454F',
    fontWeight: 'bold',
  },
  secondPlaceScore: {
    color: '#36454F',
    fontWeight: 'bold',
  },
  // --- Third Place Styles (Bronze) ---
  thirdPlaceItem: {
    backgroundColor: '#CD7F32', // Bronze background
    borderWidth: 2,
    borderColor: '#A0522D', // Darker Bronze border
    shadowColor: '#A0522D',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  thirdPlaceRankText: {
    color: '#4B3621', // Dark brown color
  },
  thirdPlaceName: {
    color: '#4B3621',
    fontWeight: 'bold',
  },
  thirdPlaceScore: {
    color: '#4B3621',
    fontWeight: 'bold',
  },
});

export default Scoreboard;
