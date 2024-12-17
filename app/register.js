import React, { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Button, TextInput, Card, Title, Paragraph } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function Register() {
  // State to handle email input
  const [email, setEmail] = useState("");

  // State to handle password input
  const [password, setPassword] = useState("");

  // Router hook to handle navigation between screens
  const router = useRouter();

  // Function to handle user registration
  const handleRegister = async () => {
    try {
      // Create a new user using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user metadata to Firestore for storing additional user information
      await setDoc(doc(db, "users", user.uid), {
        email: user.email, // User's email
        points: 0, // Initialize points to 0
        progressLevel: 1, // Set initial progress level
        riskLevel: "low", // Set default risk level
        weaknesses: ["Urgency cues", "Clicking suspicious links"], // Default weaknesses for training purposes
        certificates: [ // Predefined placeholder certificates
          {
            name: "Cybersecurity Awareness - Beginner", // Name of the certificate
            issueDate: new Date().toISOString().split("T")[0], // Current date
            blockchainLink: "https://example-blockchain.com/certificate/placeholder1", // Placeholder blockchain link
          },
          {
            name: "Phishing Awareness - Level 1", // Name of the second certificate
            issueDate: new Date().toISOString().split("T")[0], // Current date
            blockchainLink: "https://example-blockchain.com/certificate/placeholder2", // Placeholder blockchain link
          },
        ],
        createdAt: new Date().toISOString(), // Store account creation date in ISO format
      });

      // Show success alert and navigate to the home page
      Alert.alert("Registration Successful", "User registered successfully");
      router.push("/");
    } catch (error) {
      // Handle registration errors and display an alert with the error message
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Register</Title>
          <Paragraph>Create a new account by filling in the details below</Paragraph>

          {/* Input field for email */}
          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail} // Update email state on text change
            style={styles.input}
          />
          
          {/* Input field for password */}
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry // Mask the password input
            value={password}
            onChangeText={setPassword} // Update password state on text change
            style={styles.input}
          />

          {/* Button to trigger the registration process */}
          <Button mode="contained" onPress={handleRegister} style={styles.button}>
            Register
          </Button>

          {/* Button to navigate back to the login page */}
          <Button
            mode="outlined"
            onPress={() => router.push("/login")}
            style={styles.button}
          >
            Back to Login
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  // Styles for the main container
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  
  // Styles for the card container
  card: {
    padding: 16,
    borderRadius: 8,
  },
  
  // Styles for input fields
  input: {
    marginBottom: 16,
  },
  
  // Styles for buttons
  button: {
    marginTop: 16,
  },
});
