import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useRouter } from 'expo-router';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useAuth } from './authContext';

const questions = [
  // Sample questions as in your original code
];

const Planet1 = () => {
  const { currentUser } = useAuth(); // Get current user metadata
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timer, setTimer] = useState(15);
  const [gameOver, setGameOver] = useState(false);

  const handleAnswerPress = async (index) => {
    const question = questions[currentQuestionIndex];
    const correct = index === question.correctAnswer;

    if (correct) {
      setScore(score + timer * 10);
    } else {
      setLives(lives - 1);
      if (lives === 1) {
        setGameOver(true);
        return;
      }
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(10);
    } else {
      setGameOver(true);
      if (correct && currentUser) {
        // Update progressLevel in Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
          progressLevel: increment(1), // Increment progress level
          points: increment(score),   // Add the score to user's points
        });
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setLives(3);
    setTimer(10);
    setGameOver(false);
  };

  return (
    <View style={styles.container}>
      {gameOver ? (
        <View>
          <Text style={styles.gameOverText}>Game Over</Text>
          <Text style={styles.scoreText}>Your Score: {score}</Text>
          <TouchableOpacity onPress={restartQuiz}>
            <Text style={styles.restartButton}>Restart</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.livesText}>Lives: {lives}</Text>
          <Text style={styles.timerText}>Timer: {timer}s</Text>
          <Text style={styles.questionText}>{questions[currentQuestionIndex].question}</Text>
          {questions[currentQuestionIndex].options.map((option, index) => (
            <TouchableOpacity key={index} onPress={() => handleAnswerPress(index)}>
              <Text style={styles.option}>{option}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  livesText: { color: 'red', fontSize: 18 },
  timerText: { color: 'blue', fontSize: 18 },
  questionText: { fontSize: 22, marginVertical: 10 },
  option: { fontSize: 18, marginVertical: 5, color: 'white', backgroundColor: 'blue', padding: 10 },
  gameOverText: { fontSize: 28, color: 'red' },
  scoreText: { fontSize: 20, marginVertical: 10 },
  restartButton: { fontSize: 18, color: 'white', backgroundColor: 'green', padding: 10 },
});

export default Planet1;
