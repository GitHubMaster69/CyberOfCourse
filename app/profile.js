// app/profile.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { Title, Text, Button } from "react-native-paper";
import { useAuth } from "./authContext"; // Importing the auth context
import { useRouter } from "expo-router";

export default function Profile() {
  const { currentUser } = useAuth(); // Get current user from context
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Title>User Profile</Title>
      {currentUser ? (
        <>
          <Text style={styles.text}>Email: {currentUser.email}</Text>
          <Text style={styles.text}>User ID: {currentUser.uid}</Text>
          {/* You can add more user information here */}
        </>
      ) : (
        <Text style={styles.text}>No user logged in.</Text>
      )}
      <Button 
        mode="outlined" 
        onPress={() => router.push("/settings")} 
        style={styles.button}
      >
        Go to Settings
      </Button>
      <Button 
        mode="outlined" 
        onPress={() => router.push("/")} // Navigate back to home
        style={styles.button}
      >
        Back to Home
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  text: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
});
