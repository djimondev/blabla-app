"use client";

import { User, sendEmailVerification } from "firebase/auth";
import React from "react";
import { authService } from "../services/authService";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<User | null>;
  loginWithEmail: (email: string, password: string) => Promise<User | null>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<User | null>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const sendVerificationEmail = async () => {
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);
    }
  };

  const value = {
    user,
    loading,
    loginWithGoogle: authService.loginWithGoogle,
    loginWithEmail: authService.loginWithEmail,
    register: authService.register,
    logout: authService.logout,
    sendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
