import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {getDatabase, ref, set} from '@react-native-firebase/database';
import {getAuth} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScreenNavigation } from '../utils/Constants';

const GameName = () => {
  const [gameName, setGameName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleAddGame = async () => {
    if (gameName.trim() === '') {
      Alert.alert('Input Required', 'Please enter a game name.');
      return;
    }

    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getDatabase();
      const newGameRef = ref(db, `/${user.uid}/${gameName.trim()}`);

      try {
        await set(newGameRef, []);
        setGameName(''); // Clear input
        navigation?.navigate(ScreenNavigation.participant, {
          gameName: gameName.trim(),
        });
      } catch (error) {
        console.error('Error adding game:', error);
        Alert.alert('Error', `Failed to add game: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      Alert.alert('Authentication Required', 'Please sign in to add games.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.header}>Create New Game</Text>

          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Enter Game Name (e.g., Chess, Poker)"
              placeholderTextColor="#999"
              value={gameName}
              onChangeText={setGameName}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleAddGame}
            />
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddGame}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" /> 
            ) : (
              <>
                <MaterialIcons
                  name="add-circle-outline"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.addButtonText}>Add Game</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading} // Disable cancel while loading to avoid conflicts
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Light background color
  },
  scrollContent: {
    flexGrow: 1, // Allows ScrollView to grow to fill space
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 400, // Max width for larger screens
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8, // Android shadow
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1, // Take up remaining space
    backgroundColor: '#f9f9f9',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#007bff', // Primary blue
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    flexDirection: 'row', // For icon and text alignment
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 15,
    shadowColor: '#007bff',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default GameName;
