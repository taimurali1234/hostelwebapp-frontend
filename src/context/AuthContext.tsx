import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import * as authService from '../services/authService';

export interface User {
  userId: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN' | 'COORDINATOR';
  address?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  clearError: () => void;
  refreshAccessToken: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  /**
   * Initialize authentication from localStorage
   */
  const initializeAuth = () => {
    try {
      const storedUser = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');

      if (storedUser && accessToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        authService.initializeAuth();
      }
    } catch (err) {
      console.error('Failed to initialize auth:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login function
   */
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);
      const { data } = response;

      const userData: User = {
        userId: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        address: data.address,
      };

      setUser(userData);
    } catch (err: any) {
      const errorMessage = err?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
    } catch (err: any) {
      const errorMessage = err?.message || 'Logout failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register function
   */
  const register = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.register(data);
      // Registration successful, user needs to verify email
    } catch (err: any) {
      const errorMessage = err?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh access token
   */
  const refreshAccessToken = useCallback(async () => {
    try {
      await authService.refreshToken();
    } catch (err: any) {
      const errorMessage = err?.message || 'Session expired. Please login again.';
      setError(errorMessage);
      setUser(null);
      throw err;
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    register,
    clearError,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use Auth Context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
