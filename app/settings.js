// app/settings.js
import React from "react";
import { View, StyleSheet } from "react-native";
import { Title, Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function Settings() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Title>Settings</Title>
      <Text style={styles.text}>This is the settings page.</Text>
      {/* Add your settings options here */}

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
