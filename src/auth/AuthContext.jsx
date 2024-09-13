import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const setAuthToken = useCallback((token) => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setToken(null);
    }
  }, []);

  const logout = useCallback((navigate) => {
    setAuthToken(null);
    setIsAuthenticated(false);
    setUser(null);
    navigate('/auth');
  }, [setAuthToken]);

  const fetchUserProfile = useCallback(async (token) => {
    try {
      const response = await axios.get('https://bakery-pet-backend.onrender.com/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      logout();
    } finally {
      setLoadingAuth(false);  
    }
  }, [logout]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setAuthToken(storedToken);
      fetchUserProfile(storedToken);
    } else {
      setLoadingAuth(false);  
    }
  }, [fetchUserProfile, setAuthToken]);

  const login = (userData) => {
    try {
      setAuthToken(userData.token);
      setUser(userData);
      setIsAuthenticated(true);
      setLoadingAuth(false);  
    } catch (error) {
      console.error('Failed to save user to localStorage', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, loadingAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
