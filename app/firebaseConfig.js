import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4SNzjmnGvLL80_vuqPR9WzXYE-OF0eWI",
  authDomain: "cybersecurity-ofcourse.firebaseapp.com",
  projectId: "cybersecurity-ofcourse",
  storageBucket: "cybersecurity-ofcourse.appspot.com",
  messagingSenderId: "437373841752",
  appId: "1:437373841752:android:c73b27c320dcc03bc9f52d",
  databaseURL: "https://cybersecurity-ofcourse-default-rtdb.europe-west1.firebasedatabase.app", // Add if you're using Realtime Database
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { db, auth };
