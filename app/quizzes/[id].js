// app/quizzes/[id].js
import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Title, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Import Firestore db instance
import { useAuth } from "../authContext"; // Import auth context to get current user

const quizData = {
  '1': {
    question: 'What is the main goal of information security?',
    options: [
      'To protect data from unauthorized access',
      'To increase data access speed',
      'To make data publicly available',
    ],
    correctAnswer: 0,
  },
  // Add more quizzes...
};

export default function QuizPage({ params }) {
  const { id } = params;
  const quiz = quizData[id];
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();
  const { currentUser } = useAuth(); // Get current user from context

  const handleSubmit = async () => {
    const isCorrect = selectedOption === quiz.correctAnswer;

    // Show alert based on answer correctness
    alert(isCorrect ? "Correct!" : "Incorrect, try again.");

    // Update user progress in Firestore if the answer is correct
    if (isCorrect) {
      await updateUserProgress();
    }
  };

  const updateUserProgress = async () => {
    if (!currentUser) return; // If user is not logged in, exit early

    const userDoc = doc(db, "users", currentUser.uid); // Reference to user's document
    await updateDoc(userDoc, {
      points: increment(10),  // Increment points by 10 for a correct answer
      currentLevel: 2,        // Logic to determine level up can be added here
    });
  };

  return (
    <View style={styles.container}>
      <Title>{quiz.question}</Title>
      {quiz.options.map((option, index) => (
        <Button 
          key={index} 
          mode={selectedOption === index ? "contained" : "outlined"} 
          onPress={() => setSelectedOption(index)}
          style={styles.button}
        >
          {option}
        </Button>
      ))}
      <Button 
        mode="contained" 
        onPress={handleSubmit} 
        style={styles.submitButton}
        disabled={selectedOption === null} // Disable if no option is selected
      >
        Submit
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  button: {
    marginTop: 8,
  },
  submitButton: {
    marginTop: 16,
  },
});
