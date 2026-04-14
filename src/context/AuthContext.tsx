import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut, User } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          console.log("Redirect sign-in successful");
        }
      })
      .catch((err) => {
        console.error("Redirect sign-in error", err);
        setError(err.message || "Failed to sign in with Google");
      });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async () => {
    setError(null);
    try {
      // Using redirect instead of popup for better compatibility
      await signInWithRedirect(auth, googleProvider);
    } catch (err: any) {
      console.error("Login failed", err);
      setError(err.message || "Failed to initiate sign-in");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Logout failed", err);
      setError(err.message || "Failed to sign out");
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
