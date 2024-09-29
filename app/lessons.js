// app/lessons.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { Title, Card, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { db } from "../app/firebaseConfig"; // Firebase Firestore instance
import { collection, getDocs } from "firebase/firestore"; // Firestore methods

export default function Lessons() {
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      const lessonsCollection = collection(db, "lessons"); // Reference to lessons collection
      const lessonSnapshot = await getDocs(lessonsCollection);
      const lessonsList = lessonSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLessons(lessonsList);
      setLoading(false);
    };

    fetchLessons();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Title>Lessons</Title>
      <FlatList
        data={lessons}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.title}</Title>
              <Button 
                mode="contained" 
                onPress={() => router.push(`/lessons/${item.id}`)} // Navigate to individual lesson page
              >
                Start Lesson
              </Button>
            </Card.Content>
          </Card>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginVertical: 8,
    padding: 16,
  },
});
