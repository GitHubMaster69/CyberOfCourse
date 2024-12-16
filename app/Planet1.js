import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { useAuth } from './authContext';

const questions = [
  {
    question: 'What is phishing?',
    options: [
      'A type of hacking',
      'A fraudulent attempt to obtain sensitive information',
      'A secure way to send emails',
      'An antivirus software',
    ],
    correctAnswer: 1,
  },
  {
    question: 'Which of the following is a strong password?',
    options: ['password123', '123456', 'MyP@ssw0rd!', 'qwerty'],
    correctAnswer: 2,
  },
  {
    question: 'What should you do if you receive a suspicious email?',
    options: [
      'Ignore it',
      'Click the links to investigate',
      'Report it to your IT department',
      'Reply to ask for more information',
    ],
    correctAnswer: 2,
  },
];

const Planet1 = () => {
  const { currentUser } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timer, setTimer] = useState(15);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timer === 0) {
      handleAnswerPress(null); // Treat timeout as incorrect answer
    }
  }, [timer, gameOver]);

  const handleAnswerPress = async (index) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
      return;
    }

    const correct = index === currentQuestion.correctAnswer;

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
      setTimer(15); // Reset timer for the next question
    } else {
      setGameOver(true);
      if (correct && currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
          progressLevel: increment(1),
          points: increment(score),
        });
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setLives(3);
    setTimer(15);
    setGameOver(false);
  };

  if (!questions || questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No questions available.</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex] || {};

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
          {currentQuestion.question ? (
            <>
              <Text style={styles.questionText}>{currentQuestion.question}</Text>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity key={index} onPress={() => handleAnswerPress(index)}>
                  <Text style={styles.option}>{option}</Text>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <Text style={styles.errorText}>No question found.</Text>
          )}
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
  errorText: { fontSize: 18, color: 'red' },
});

export default Planet1;
