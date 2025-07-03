

import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { User, AuthContextType } from '../types';

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
  
  // New function to refetch user data from the server
  const refetchUser = useCallback(async () => {
    if (!authData.token) return; // Can't refetch without a token
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authData.token}`
        }
      });
      if (!response.ok) {
        // If the token is invalid (e.g., expired), log the user out
        if (response.status === 401) {
            logout();
        }
        throw new Error('Could not refetch user data');
      }
      const refreshedUser: User = await response.json();
      // Use the login function to update the user state everywhere
      login(authData.token, refreshedUser);
    } catch (error) {
      console.error("Failed to refetch user:", error);
    }
  }, [authData.token]);


  const isAuthenticated = !!authData.token && !!authData.user;
  const isAdmin = authData.user?.role === 'admin';

  const value = useMemo(() => ({ authData, login, logout, updatePoints, refetchUser, isAuthenticated, isAdmin }), [authData, refetchUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};