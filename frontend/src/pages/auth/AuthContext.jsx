import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "../../firebase";
import { onAuthStateChanged} from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { isToday } from 'date-fns';
import { calculateCycleInfo } from '../../components/CycleCalculation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listens for any change in the user's login state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userProfileRef = doc(db, 'userProfiles', user.uid);
          const docSnap = await getDoc(userProfileRef);

          if (docSnap.exists()) {
            const profileData = docSnap.data();
            
            // Check if the cycle info needs to be recalculated (i.e., it's not from today)
            const needsUpdate = !profileData.cycleInfo || !profileData.cycleInfo.lastCalculated || !isToday(new Date(profileData.cycleInfo.lastCalculated));

            if (needsUpdate) {
              console.log("Cycle data is stale or missing. Recalculating...");
              const newCycleInfo = calculateCycleInfo(profileData);
              
              if (newCycleInfo) {
                // Save the newly calculated info back to Firestore
                await setDoc(userProfileRef, { cycleInfo: newCycleInfo }, { merge: true });
                console.log("Successfully updated cycle info in Firestore.");
              }
            } else {
                console.log("Cycle data is up-to-date.");
            }
          }
        } catch (error) {
            console.error("Error updating cycle info on login:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  // Only rendered when auth state is known
  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  );
  
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
}