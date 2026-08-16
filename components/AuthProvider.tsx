"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth is mocked (no real config), just set a dummy unauthenticated state
    if (!auth || typeof auth.onAuthStateChanged !== 'function') {
      const { onAuthStateChanged } = require("firebase/auth");
      try {
         // Attempt to use real auth if somehow it was initialized
         const unsubscribe = onAuthStateChanged(auth, (user: any) => {
           setUser(user);
           setLoading(false);
         });
         return () => unsubscribe();
      } catch(e) {
         setLoading(false);
         return;
      }
    } else {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
