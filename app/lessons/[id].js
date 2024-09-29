// app/lessons/[id].js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Title, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { db } from "../firebaseConfig"; // Import Firestore
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useAuth } from "../authContext"; // Import auth context to get current user

export default function LessonPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const [lesson, setLesson] = useState(null);
  const { currentUser } = useAuth(); // Get current user from context

  useEffect(() => {
    const fetchLesson = async () => {
      const lessonDoc = doc(db, "lessons", id); // Reference to the specific lesson document
      const lessonSnapshot = await getDoc(lessonDoc);

      if (lessonSnapshot.exists()) {
        setLesson({ id: lessonSnapshot.id, ...lessonSnapshot.data() });
      } else {
        console.log("No such document!");
      }
    };

    fetchLesson();
  }, [id]);

  const handleCompleteLesson = async () => {
    if (!currentUser) {
      alert("Please log in to mark the lesson as complete.");
      return;
    }

    const lessonDoc = doc(db, "lessons", id);
    await updateDoc(lessonDoc, {
      completedBy: arrayUnion(currentUser.uid), // Add user ID to completedBy array
    });
    
    alert("Lesson marked as complete!");
    router.push("/profile"); // Redirect to profile after completion
  };

  if (!lesson) {
    return <Text>Loading lesson...</Text>;
  }

  return (
    <View style={styles.container}>
      <Title>{lesson.title}</Title>
      <Text>{lesson.content}</Text>
      <Button 
        mode="contained" 
        onPress={handleCompleteLesson} 
        style={styles.button}
      >
        Mark as Complete
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
    marginTop: 16,
  },
});
