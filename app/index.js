import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Card, Title, Paragraph } from "react-native-paper";
import { useAuth } from "./authContext";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import ChatBot from "./chatBot"; // Import the ChatBot component

export default function Index() {
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Welcome to InfoSec Academy!</Title>
          <Paragraph>
            {currentUser 
              ? `Hello, ${currentUser.email}! Ready to boost your information security skills?`
              : "Please log in to access your personalized learning journey."}
          </Paragraph>
          
          {currentUser ? (
            <>
              <Button 
                mode="contained" 
                onPress={() => router.push("/lessons")} 
                style={styles.button}
              >
                Start Learning
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => router.push("/profile")}  // Navigate to Profile
                style={styles.button}
              >
                Profile
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => router.push("/settings")}  // Navigate to Settings
                style={styles.button}
              >
                  settings
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => router.push("/dashboard")}  // Navigate to Settings
                style={styles.button}
              >
                    test
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => router.push("/phishingGame")}  // Navigate to Settings
                style={styles.button}
              >
                  Dashboard
              </Button>
              <Button 
                mode="outlined" 
                onPress={handleSignOut}  // Call handleSignOut for logout
                style={styles.button}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                mode="contained" 
                onPress={() => router.push("/login")} 
                style={styles.button}
              >
                Login
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => router.push("/register")} 
                style={styles.button}
              >
                Register
              </Button>
            </>
          )}
        </Card.Content>
      </Card>
      {/* Add the ChatBot component here */}
      <ChatBot /> 
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
  button: {
    marginTop: 16,
  },
});
