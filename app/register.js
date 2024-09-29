// app/register.js
import React, { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Button, TextInput, Card, Title, Paragraph } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "expo-router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        points: 0,
        currentLevel: 1,
      });

      Alert.alert("Registration Successful", "User registered successfully");
      router.push("/");
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Register</Title>
          <Paragraph>Create a new account by filling in the details below</Paragraph>

          <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            label="Password"
            mode="outlined"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <Button mode="contained" onPress={handleRegister} style={styles.button}>
            Register
          </Button>
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
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});
