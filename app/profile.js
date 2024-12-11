import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Text, Button } from 'react-native-paper';
import { useAuth } from './authContext';

export default function Profile() {
  const { currentUser } = useAuth();

  return (
    <View style={styles.container}>
      <Title>User Profile</Title>
      {currentUser ? (
        <>
          <Text>Email: {currentUser.email}</Text>
          <Text>Progress Level: {currentUser.progressLevel}</Text>
          <Text>Risk Level: {currentUser.riskLevel}</Text>
          <Text>Points: {currentUser.points}</Text>
        </>
      ) : (
        <Text>No user logged in.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
