import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ScrollView,
  PanResponder,
  Animated,
} from "react-native";

export default function ChatBot() {
  const [messages, setMessages] = useState([{ 
    role: "system", 
    content: "🎉 Hello, Cyber Guardian! I'm your enthusiastic cybersecurity assistant!" 
  }]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Position for the draggable chat widget
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // PanResponder for drag functionality
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        position.setOffset({
          x: position.x._value,
          y: position.y._value,
        });
        position.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (evt, gestureState) => {
        position.setValue({
          x: gestureState.dx,
          y: gestureState.dy,
        });
      },
      onPanResponderRelease: () => {
        position.flattenOffset(); // Flatten the offset
      },
    })
  ).current;

  const handleSend = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer `, // Replace with your actual OpenAI API Key
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: newMessages
        })
      });

      const data = await response.json();
      const botReply = data.choices[0].message;
      setMessages((prevMessages) => [...prevMessages, botReply]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "system", content: "🚨 Oops! Something went wrong." }
      ]);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.fabContainer,
          { transform: position.getTranslateTransform() },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.fab} onTouchEnd={toggleChat}>
          <Text style={styles.fabText}>💬</Text>
        </View>
      </Animated.View>

      {/* Static chat box */}
      {isOpen && (
        <View style={[styles.chatBox, { top: position.y, left: position.x }]}>
          <ScrollView style={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <Text key={index} style={msg.role === "user" ? styles.userText : styles.botText}>
                {msg.content}
              </Text>
            ))}
          </ScrollView>
          <TextInput
            style={styles.input}
            placeholder="Type your message"
            value={input}
            onChangeText={setInput}
          />
          <Button title="Send" onPress={handleSend} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  fab: {
    backgroundColor: '#007AFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
  },
  chatBox: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    width: 300,
    maxHeight: 400,
    padding: 10,
    position: 'absolute',
  },
  messagesContainer: {
    maxHeight: 300,
  },
  userText: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
    padding: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  botText: {
    alignSelf: "flex-start",
    backgroundColor: "#ECECEC",
    padding: 8,
    borderRadius: 8,
    marginBottom: 5,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 15, // Increased padding for a larger text box
    borderRadius: 5,
    marginBottom: 5,
  },
});
