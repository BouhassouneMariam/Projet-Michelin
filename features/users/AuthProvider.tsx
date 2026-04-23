"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from "react";

type AuthContextValue = {
  isAuthenticated: boolean;
  setAuthenticated: () => void;
  setUnauthenticated: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialIsAuthenticated
}: {
  children: ReactNode;
  initialIsAuthenticated: boolean;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);

  const setAuthenticated = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const setUnauthenticated = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      setAuthenticated,
      setUnauthenticated
    }),
    [isAuthenticated, setAuthenticated, setUnauthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
