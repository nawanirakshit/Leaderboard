import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { getAuth } from '@react-native-firebase/auth'; // Import update
import { useNavigation } from '@react-navigation/native'; // For navigation (e.g., if logging out goes to login screen)
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../utils/AuthContex';

const ProfileScreen = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();
  const {user, logout} = useAuth();

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUserEmail(currentUser.email || 'N/A');
      const displayName = currentUser.displayName;
      setUserName(displayName || currentUser.email.split('@')[0] || 'User');

      if (displayName) {
        setUserInitial(displayName[0].toUpperCase());
      } else if (currentUser.email) {
        setUserInitial(currentUser.email[0].toUpperCase());
      } else {
        setUserInitial('?');
      }
    } else {
      Alert.alert("Not Signed In", "No user is currently signed in.");
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Log Out",
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              await auth.signOut(); // Sign out the user
              await logout();
              Alert.alert("Logged Out", "You have been successfully logged out.");
            } catch (error) {
              console.error("Error logging out:", error);
              Alert.alert("Logout Error", error.message);
            } finally {
              setIsLoggingOut(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        {/* Circle with First Initial */}
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarInitial}>{userInitial}</Text>
        </View>

        {/* User Name and Email */}
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <MaterialIcons name="mail-outline" size={24} color="#666" style={styles.detailIcon} />
          <Text style={styles.detailText}>{userEmail}</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        disabled={isLoggingOut} // Disable during logout process
      >
        {isLoggingOut ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <MaterialIcons name="logout" size={20} color="#fff" style={styles.logoutIcon} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Light grey background
    alignItems: 'center',
    paddingTop: 30, // Space from top
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 25,
    paddingHorizontal: 40,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50, // Makes it a circle
    backgroundColor: '#6200EE', // Primary color for avatar background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#b388ff', // Lighter shade for border
  },
  avatarInitial: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#777',
  },
  detailsContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#dc3545', // Red for logout
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    maxWidth: 300,
    shadowColor: '#dc3545',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
