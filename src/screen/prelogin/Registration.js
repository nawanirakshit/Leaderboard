import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useAuth} from '../../utils/AuthContex';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@react-native-firebase/auth';
import {useLoading} from '../../utils/loading/LoadingContext';

const RegistrationScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {login} = useAuth();
  const {showLoading, hideLoading, isLoading} = useLoading();

  const handleRegister = () => {
    // Basic validation
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    showLoading();
    createUserWithEmailAndPassword(getAuth(), email, password)
      .then(userCredential => {
        const user = userCredential.user;

        if (user) {
          updateProfile(user, {displayName: name});
        }

        const {uid, email: userEmail} = user;

        const userData = {
          token: uid,
          email: userEmail,
          name: name,
          password: password,
        };
        hideLoading();
        login(userData);
      })
      .catch(error => {
        hideLoading();
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Error', 'That email address is already in use!', [
            {text: 'Try Again'},
          ]);
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'That email address is invalid!', [
            {text: 'Try Again'},
          ]);
        } else {
          Alert.alert('Error', error.message, [{text: 'Try Again'}]);
        }
      });
  };

  const handleBackToLogin = () => {
    // Navigate back to the previous screen
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={handleRegister}
          style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBackToLogin} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
});

export default RegistrationScreen;
