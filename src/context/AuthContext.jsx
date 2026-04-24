import React, { createContext, useContext, useState, useCallback } from 'react';
import { logoutUser } from '../API/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  // On page refresh → restore from localStorage
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('accessToken');
  });

  // Called after successful login
  const login = useCallback((userData, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  // Called on logout
  const logout = useCallback(async () => {
    // Clear tokens immediately to prevent stale token issues
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    
    try {
      await logoutUser();
    } catch (err) {
      console.log('Logout error:', err);
    }
  }, []);

  const value = { user, isAuthenticated, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};