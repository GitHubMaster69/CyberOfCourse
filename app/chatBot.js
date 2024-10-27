import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from "react-native";

export default function ChatBot() {
  const [messages, setMessages] = useState([{ 
    role: "system", 
    content: "🎉 Hello, Cyber Guardian! I'm your enthusiastic cybersecurity assistant, here to make learning about cybersecurity fun and engaging! 🛡️ What challenges or questions can I help you with today?" 
  }]);
  const [input, setInput] = useState("");

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
          "Authorization": "Bearer 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", // Replace with your actual OpenAI API Key
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
        { role: "system", content: "🚨 Oops! Something went wrong. Don't worry, you can try again later! 🔄" }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.chatBox}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  chatBox: {
    flex: 1,
    marginBottom: 10,
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
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
});