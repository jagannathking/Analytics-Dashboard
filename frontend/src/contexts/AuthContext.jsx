import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getMe, login as apiLogin, register as apiRegister } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const applyTheme = useCallback((selectedTheme) => {
    document.body.className = selectedTheme === 'light' ? 'light-mode' : '';
    localStorage.setItem('theme', selectedTheme);
    setTheme(selectedTheme);
  }, []);

  useEffect(() => {
    applyTheme(theme); // Apply initial theme
  }, [applyTheme, theme]);


  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        setLoading(true);
        const { data } = await getMe();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user, removing token.', error.response?.data?.message || error.message);
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await apiLogin(credentials);
      localStorage.setItem('authToken', data.token);
      setUser({ _id: data._id, username: data.username, role: data.role });
      setLoading(false);
      return true;
    } catch (error) {
      setLoading(false);
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Backend register might return user and token or just a success message
      await apiRegister(userData);
      setLoading(false);
      return { success: true, message: "Registration successful! Please login." };
    } catch (error) {
      setLoading(false);
      console.error('Registration failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    // navigate('/login') could be called here if AuthContext had access to router,
    // or handled in the component calling logout.
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, register, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
};