"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  setAuthenticated: () => void;
  setUnauthenticated: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ 
  children, 
  initialIsAuthenticated 
}: { 
  children: ReactNode;
  initialIsAuthenticated: boolean;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);

  const setAuthenticated = () => setIsAuthenticated(true);
  const setUnauthenticated = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated, setUnauthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
