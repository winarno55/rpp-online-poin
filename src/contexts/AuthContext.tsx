import React, { createContext, useState, useEffect, useMemo } from 'react';
import { User, AuthContextType } from '../../shared/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authData, setAuthData] = useState<{ token: string | null; user: User | null }>({
    token: null,
    user: null,
  });

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      if (storedToken && storedUser) {
        setAuthData({ token: storedToken, user: JSON.parse(storedUser) });
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authUser', JSON.stringify(user));
    setAuthData({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setAuthData({ token: null, user: null });
  };

  const updatePoints = (newPoints: number) => {
    setAuthData((prev) => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, points: newPoints };
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  };

  const isAuthenticated = !!authData.token && !!authData.user;
  const isAdmin = authData.user?.role === 'admin';

  const value = useMemo(() => ({ authData, login, logout, updatePoints, isAuthenticated, isAdmin }), [authData]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};