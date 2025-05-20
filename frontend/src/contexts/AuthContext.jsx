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
    applyTheme(theme);
  }, [applyTheme, theme]);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Keep loading true until user is fetched or error occurs
        // setLoading(true); // setLoading(true) is already outside if(token)
        const { data } = await getMe();
        setUser(data); // data should be { _id, username, role }
      } catch (error) {
        console.error('Failed to fetch user, removing token.', error.response?.data?.message || error.message);
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false); // No token, not authenticated
    }
  }, []);

  useEffect(() => {
    setLoading(true); // Set loading true when AuthProvider mounts
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await apiLogin(credentials); // data = { _id, username, role, token }
      localStorage.setItem('authToken', data.token);
      setUser({ _id: data._id, username: data.username, role: data.role }); // Set user from response
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
      // Backend's /api/auth/register currently expects username, password, and optionally role.
      // For self-registration, it's best if the backend assigns a default role
      // if one isn't provided or if it's a public registration endpoint.
      const response = await apiRegister(userData);
      setLoading(false);
      // Assuming backend responds with a success message or relevant data
      return { success: true, message: response.data?.message || "Registration successful! Please login." };
    } catch (error) {
      setLoading(false);
      console.error('Registration failed:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    // Navigation to /login is usually handled by ProtectedRoute or in the component calling logout.
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