import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Text, Linking } from "react-native";
import { Title, ActivityIndicator } from "react-native-paper";
import { useAuth } from "./authContext";
import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function Profile() {
  const { currentUser } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setCertificates(userData.certificates || []); // Use empty array if no certificates
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <View style={styles.container}>
      <Title>User Profile</Title>
      {currentUser ? (
        <>
          <Text>Email: {currentUser.email}</Text>
          <Text>Progress Level: {currentUser.progressLevel}</Text>
          <Text>Risk Level: {currentUser.riskLevel}</Text>
          <Text>Points: {currentUser.points}</Text>

          <Title style={styles.sectionTitle}>Certificates</Title>
          {loading ? (
            <ActivityIndicator />
          ) : certificates.length > 0 ? (
            <ScrollView style={styles.certificatesContainer}>
              {certificates.map((cert, index) => (
                <View key={index} style={styles.certificateCard}>
                  <Text style={styles.certificateTitle}>{cert.name}</Text>
                  <Text>Issued On: {cert.issueDate}</Text>
                  <Text
                    style={styles.blockchainLink}
                    onPress={() => Linking.openURL(cert.blockchainLink)}
                  >
                    View on Blockchain
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text>No certificates found.</Text>
          )}
        </>
      ) : (
        <Text>No user logged in.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  certificatesContainer: {
    marginTop: 10,
    width: "100%",
  },
  certificateCard: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  certificateTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  blockchainLink: {
    color: "#007AFF",
    marginTop: 5,
  },
});
