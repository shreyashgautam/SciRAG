import React, { createContext, useContext, useState } from 'react';
import { UserProfile } from '../types';
import {
  getCurrentUser,
  isAuthenticated,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister
} from '../services/authService';

interface AuthContextType {
  user: UserProfile;
  isLoggedIn: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (name: string, email: string, password: string, interests: string[]) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(getCurrentUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isAuthenticated);

  const login = async (email: string, password?: string) => {
    const loggedInUser = await apiLogin(email, password);
    setUser(loggedInUser);
    setIsLoggedIn(true);
  };

  const register = async (name: string, email: string, password: string, interests: string[]) => {
    const newUser = await apiRegister(name, email, password, interests);
    setUser(newUser);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await apiLogout();
    setIsLoggedIn(false);
  };

  const updateUser = (updated: Partial<UserProfile>) => {
    const next = { ...user, ...updated };
    setUser(next);
    localStorage.setItem('scirag_user', JSON.stringify(next));
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
