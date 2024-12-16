import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

export async function fetchEmployeeMetadata(uid) {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        name: data.name || "Employee",
        email: data.email,
        points: data.points || 0,
        progressLevel: data.progressLevel || 1,
        riskLevel: data.riskLevel || "low",
        weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses : [],
      };
    } else {
      throw new Error("No user metadata found for the given UID");
    }
  } catch (error) {
    console.error("Error fetching employee metadata:", error);
    throw error;
  }
}
