// app/authContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch the user's document from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            // Merge Firebase Auth user data with Firestore metadata
            setCurrentUser({
              uid: user.uid,
              email: user.email,
              ...userDoc.data(), // Include Firestore metadata like progressLevel, riskLevel
            });
          } else {
            console.error("No user document found in Firestore.");
            setCurrentUser({ uid: user.uid, email: user.email }); // Fallback if no document is found
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
          setCurrentUser({ uid: user.uid, email: user.email }); // Fallback if fetching fails
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
