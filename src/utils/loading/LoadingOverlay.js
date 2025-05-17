import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useLoading } from './LoadingContext'; // Adjust the path if needed

const LoadingOverlay = () => {
  const { isLoading } = useLoading();

  if (!isLoading) {
    return null; // Don't render if not loading
  }

  return (
    <View style={styles.loadingOverlay}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingOverlay: {
    // Removed StyleSheet.absoluteFillObject and fixed backgroundColor
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: 'white',
  },
});

export default LoadingOverlay;
