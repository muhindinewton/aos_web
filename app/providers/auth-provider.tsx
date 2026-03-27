'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for saved auth
    const saved = localStorage.getItem('aos-user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in production, integrate with Firebase Auth
    const mockUser: User = {
      id: '1',
      email,
      displayName: email.split('@')[0],
      photoURL: null,
    };
    setUser(mockUser);
    localStorage.setItem('aos-user', JSON.stringify(mockUser));
  };

  const signup = async (email: string, password: string, name: string) => {
    // Mock signup
    const mockUser: User = {
      id: '1',
      email,
      displayName: name,
      photoURL: null,
    };
    setUser(mockUser);
    localStorage.setItem('aos-user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aos-user');
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
