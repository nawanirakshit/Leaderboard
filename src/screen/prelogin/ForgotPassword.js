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
import {getAuth, sendPasswordResetEmail} from '@react-native-firebase/auth';
import {useLoading} from '../../utils/loading/LoadingContext';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const {showLoading, hideLoading, isLoading} = useLoading();

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
    showLoading();
    sendPasswordResetEmail(getAuth(), email)
      .then(() => {
        hideLoading();
        Alert.alert(
          'Success',
          'Reset instructions sent successfully on the email',
          [{text: 'Ok'}],
        );
        navigation.goBack();
      })
      .catch(error => {
        hideLoading();
        const errorMessage = error.message;
        Alert.alert('Error', errorMessage, [{text: 'Try Again'}]);
      });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          onPress={handleResetPassword}
          style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
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
  resetButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: {
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

export default ForgotPasswordScreen;
