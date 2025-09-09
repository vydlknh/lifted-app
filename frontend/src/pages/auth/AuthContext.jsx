import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from "../../firebase";
import { onAuthStateChanged} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listens for any change in the user's login state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
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