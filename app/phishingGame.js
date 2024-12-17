import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert, ScrollView, Animated } from "react-native";
import { fetchEmployeeMetadata } from "./employeeMetadata";
import { generatePhishingEmail } from "./openaiHelpers";
import { useAuth } from "./authContext";
import { db } from "./firebaseConfig";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";

export default function PhishingGame() {
  const { currentUser } = useAuth();
  const [phishingEmail, setPhishingEmail] = useState("");
  const [correctResponse, setCorrectResponse] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState(null);
  const [feedbackColor, setFeedbackColor] = useState(new Animated.Value(0)); // Animation for feedback

  useEffect(() => {
    const setupGame = async () => {
      if (!currentUser) return;

      try {
        const userMetadata = await fetchEmployeeMetadata(currentUser.uid);

        if (!userMetadata.weaknesses || userMetadata.weaknesses.length === 0) {
          userMetadata.weaknesses = ["General cybersecurity"];
        }

        setMetadata(userMetadata);
        const { email, correctResponse, options } = await generatePhishingEmail(userMetadata);

        setPhishingEmail(replacePlaceholders(email));
        setCorrectResponse(correctResponse);
        setOptions(options.filter((opt) => !opt.includes("Phishing Indicator"))); // Exclude questions from options
        setLoading(false);
      } catch (error) {
        console.error("Error setting up game:", error);
        Alert.alert("Error", "Unable to set up the game. Please try again later.");
      }
    };

    setupGame();
  }, [currentUser]);

  const replacePlaceholders = (email) => {
    return email.replace(/\[.*?\]/g, "[Link]").replace("Malicious Link", "Suspicious Link");
  };

  const handleOptionSelect = async (selectedOption) => {
    if (!metadata || !currentUser) return;

    const userDocRef = doc(db, "users", currentUser.uid);

    if (selectedOption === correctResponse) {
      Animated.timing(feedbackColor, {
        toValue: 1, // Green feedback for correct
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        // Reset the feedback animation after it's done
        feedbackColor.setValue(0);
        generateNewScenario(); // Automatically go to next scenario
      });

      await updateDoc(userDocRef, {
        points: increment(10),
        riskLevel: metadata.riskLevel === "high" ? "medium" : metadata.riskLevel === "medium" ? "low" : "low",
      });

      setMetadata({
        ...metadata,
        points: metadata.points + 10,
        riskLevel: metadata.riskLevel === "high" ? "medium" : metadata.riskLevel === "medium" ? "low" : "low",
      });
    } else {
      Animated.timing(feedbackColor, {
        toValue: -1, // Red feedback for incorrect
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        feedbackColor.setValue(0); // Reset feedback
      });

      await updateDoc(userDocRef, {
        weaknesses: arrayUnion(selectedOption),
        riskLevel: metadata.riskLevel === "low" ? "medium" : "high",
      });

      setMetadata({
        ...metadata,
        weaknesses: [...metadata.weaknesses, selectedOption],
        riskLevel: metadata.riskLevel === "low" ? "medium" : "high",
      });

      Alert.alert("Incorrect", "This is not the phishing indicator. Please try again.");
    }
  };

  const generateNewScenario = async () => {
    setLoading(true);
    try {
      const { email, correctResponse, options } = await generatePhishingEmail(metadata);

      setPhishingEmail(replacePlaceholders(email));
      setCorrectResponse(correctResponse);
      setOptions(options.filter((opt) => !opt.includes("Phishing Indicator")));
    } catch (error) {
      console.error("Error generating new phishing scenario:", error);
      Alert.alert("Error", "Unable to generate a new phishing scenario. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading phishing scenario...</Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: feedbackColor.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: ["#FFCCCC", "#FFFFFF", "#CCFFCC"], // Red, white, green
          }),
        },
      ]}
    >
      <Text style={styles.header}>Phishing Email Game</Text>
      <ScrollView style={styles.emailContainer}>
        <Text style={styles.emailText}>{phishingEmail}</Text>
      </ScrollView>
      <Text style={styles.question}>What is the phishing indicator in this email?</Text>
      {options.map((option, index) => (
        <Button
          key={index}
          title={option}
          onPress={() => handleOptionSelect(option)}
          style={styles.optionButton}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  emailContainer: {
    marginBottom: 20,
    maxHeight: 300,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
  },
  emailText: {
    fontSize: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionButton: {
    marginVertical: 10,
  },
});
