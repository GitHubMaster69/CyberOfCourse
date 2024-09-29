// app/login.js
import React, { useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Button, TextInput, Card, Title, Paragraph } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Login</Title>
          <Paragraph>Enter your email and password to log in</Paragraph>

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

          <Button mode="contained" onPress={handleLogin} style={styles.button}>
            Login
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.push("/register")}
            style={styles.button}
          >
            Register
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
