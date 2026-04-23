"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuthenticated: () => void;
  setUnauthenticated: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ 
  children, 
  initialIsAuthenticated,
  initialIsAdmin
}: { 
  children: ReactNode;
  initialIsAuthenticated: boolean;
  initialIsAdmin: boolean;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);
  const [isAdmin] = useState(initialIsAdmin);

  const setAuthenticated = () => setIsAuthenticated(true);
  const setUnauthenticated = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isAdmin, setAuthenticated, setUnauthenticated }}
    >
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
