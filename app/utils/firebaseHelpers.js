import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const fetchDashboardData = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const companySnapshot = await getDocs(collection(db, "company"));

    const employees = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const company = companySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))[0];

    if (!employees.length || !company) {
      throw new Error("No data found in Firebase");
    }

    return { employees, company };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

