import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert, ScrollView } from "react-native";
import { fetchEmployeeMetadata } from "./employeeMetadata"; // Helper to fetch metadata
import { generatePhishingEmail } from "./openaiHelpers"; // Helper to generate phishing emails
import { useAuth } from "./authContext"; // Get current user's metadata
import { db } from "./firebaseConfig";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";

export default function PhishingGame() {
  const { currentUser } = useAuth();
  const [phishingEmail, setPhishingEmail] = useState("");
  const [correctResponse, setCorrectResponse] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState(null); // Store user metadata locally

  useEffect(() => {
    const setupGame = async () => {
      if (!currentUser) return;

      try {
        // Fetch employee metadata
        const userMetadata = await fetchEmployeeMetadata(currentUser.uid);

        // Ensure weaknesses have default values if empty
        if (!userMetadata.weaknesses || userMetadata.weaknesses.length === 0) {
          userMetadata.weaknesses = ["General cybersecurity"];
        }

        setMetadata(userMetadata);

        // Generate a phishing email based on weaknesses
        const { email, correctResponse, options } = await generatePhishingEmail(userMetadata);

        setPhishingEmail(email);
        setCorrectResponse(correctResponse);
        setOptions(options);
        setLoading(false);
      } catch (error) {
        console.error("Error setting up game:", error);
        Alert.alert("Error", "Unable to set up the game. Please try again later.");
      }
    };

    setupGame();
  }, [currentUser]);

  const handleOptionSelect = async (selectedOption) => {
    if (!metadata || !currentUser) return;

    const userDocRef = doc(db, "users", currentUser.uid);

    if (selectedOption === correctResponse) {
      Alert.alert("Correct!", "You identified the phishing indicator.");

      // Update user points and possibly lower risk level
      await updateDoc(userDocRef, {
        points: increment(10), // Award points
        riskLevel: metadata.riskLevel === "high" ? "medium" : metadata.riskLevel === "medium" ? "low" : "low", // Lower risk level
      });

      // Update local metadata
      setMetadata({
        ...metadata,
        points: metadata.points + 10,
        riskLevel: metadata.riskLevel === "high" ? "medium" : metadata.riskLevel === "medium" ? "low" : "low",
      });
    } else {
      Alert.alert("Incorrect", "This is not the phishing indicator. Please try again.");

      // Add the scenario as a weakness
      await updateDoc(userDocRef, {
        weaknesses: arrayUnion(selectedOption), // Add the incorrectly selected option to weaknesses
        riskLevel: metadata.riskLevel === "low" ? "medium" : "high", // Increase risk level
      });

      // Update local metadata
      setMetadata({
        ...metadata,
        weaknesses: [...metadata.weaknesses, selectedOption],
        riskLevel: metadata.riskLevel === "low" ? "medium" : "high",
      });
    }
  };

  const generateNewScenario = async () => {
    setLoading(true);
    try {
      // Generate a new phishing email based on updated metadata
      const { email, correctResponse, options } = await generatePhishingEmail(metadata);

      setPhishingEmail(email);
      setCorrectResponse(correctResponse);
      setOptions(options);
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
    <View style={styles.container}>
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
        />
      ))}
      <Button
        title="Next Scenario"
        onPress={generateNewScenario}
        style={styles.nextButton}
      />
    </View>
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
  nextButton: {
    marginTop: 20,
  },
});
