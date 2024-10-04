import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useRouter } from "expo-router";


const questions = [
  {
    question: 'What is phishing?',

    options: ['A type of hacking', 'A fraudulent attempt to obtain sensitive information', 'A secure way to send emails', 'An antivirus software'],
    correctAnswer: 1,
  },
  {
    question: 'Which of the following is a strong password?',
    options: ['password123', '123456', 'MyP@ssw0rd!', 'qwerty'],
    correctAnswer: 2,
  },
  {
    question: 'What should you do if you receive a suspicious email?',
    options: ['Ignore it', 'Click the links to investigate', 'Report it to your IT department', 'Reply to ask for more information'],
    correctAnswer: 2,
  },
  // Add more questions as needed
];

const Planet1 = () => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3); // Player starts with 3 lives
  const [timer, setTimer] = useState(15); // 15 seconds per question
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [gameOver, setGameOver] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false); // Confetti control
  const [hintUsed, setHintUsed] = useState(false); // Track if the hint has been used
  const [filteredOptions, setFilteredOptions] = useState(questions[0].options); // To store filtered options after using the hint

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        if (timer > 0) {
          setTimer(timer - 1);
        } else {
          handleAnswerPress(null); // Auto-answer as incorrect if timer runs out
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, gameOver]);

  useEffect(() => {
    // Reset filtered options and progress animation with each new question
    setFilteredOptions(questions[currentQuestionIndex].options);
    Animated.timing(progress, {
      toValue: (currentQuestionIndex + 1) / questions.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentQuestionIndex]);

  const handleAnswerPress = (index) => {
    if (index === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + timer * 10); // Reward quick answers with higher points
      setConfettiActive(true); // Show confetti on correct answer

      // Hide confetti after a short duration
      setTimeout(() => {
        setConfettiActive(false);
      }, 2000);
    } else {
      setLives(lives - 1); // Lose a life for incorrect answers
      if (lives === 1) {
        setGameOver(true);
        return;
      }
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(10); // Reset timer for the next question
    } else {
      setGameOver(true); // Quiz is complete
    }
  };

  // Use the hint to remove one incorrect option
  const useHint = () => {
    if (!hintUsed) {
      const incorrectOptions = questions[currentQuestionIndex].options
        .map((option, index) => ({ option, index }))
        .filter(item => item.index !== questions[currentQuestionIndex].correctAnswer);
      
      // Randomly remove one incorrect option
      const randomIncorrect = incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
      const newOptions = filteredOptions.filter((_, index) => index !== randomIncorrect.index);

      setFilteredOptions(newOptions); // Update the options to show only the remaining ones
      setHintUsed(true); // Disable hint for future questions
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setLives(3);
    setTimer(10);
    setGameOver(false);
    setProgress(new Animated.Value(0));
    setConfettiActive(false); // Reset confetti
    setHintUsed(false); // Reset hint
  };

  if (gameOver) {
    return (
      <View style={styles.container}>
        <Text style={styles.gameOverText}>Game Over!</Text>
        <Text style={styles.resultText}>Your Score: {score}</Text>
        <TouchableOpacity onPress={restartQuiz} style={styles.button}>
          <Text style={styles.buttonText}>Restart Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Lives */}
      <Text style={styles.livesText}>Lives: {lives}</Text>

      {/* Timer */}
      <Text style={styles.timerText}>Time: {timer}s</Text>

      {/* Progress Bar */}
      <Animated.View style={[styles.progressBar, { width: progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
      }) }]} />

      {/* Question */}
      <Text style={styles.questionText}>
        {questions[currentQuestionIndex].question}
      </Text>

      {/* Options */}
      {filteredOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => handleAnswerPress(index)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}

      {/* Hint Button */}
      <TouchableOpacity
        onPress={useHint}
        style={[styles.hintButton, hintUsed && styles.disabledHintButton]}
        disabled={hintUsed} // Disable if hint is already used
      >
        <Text style={styles.hintButtonText}>{hintUsed ? 'Remove one option already used' : 'Remove one option'}</Text>
      </TouchableOpacity>

      {/* Score */}
      <Text style={styles.scoreText}>Score: {score}</Text>

      {/* Confetti on correct answer */}
      {confettiActive && (
        <ConfettiCannon
          count={100}
          origin={{ x: -10, y: 0 }}
          fadeOut={true}
          autoStart={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  livesText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 20,
  },
  timerText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'green',
    marginBottom: 20,
  },
  questionText: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#1E90FF',
    padding: 15,
    marginVertical: 10,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
  },
  scoreText: {
    color: '#fff',
    fontSize: 20,
    marginTop: 20,
  },
  gameOverText: {
    fontSize: 32,
    color: 'red',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  hintButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  disabledHintButton: {
    backgroundColor: '#C0C0C0',
  },
  hintButtonText: {
    color: '#000',
    fontSize: 16,
  },
});

export default Planet1;