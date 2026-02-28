import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, getUser, storeToken, clearAuth } from '../utils/storage';
import api, { BASE_URL } from '../api/client';
import Toast from 'react-native-toast-message';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadStoredData = async () => {
      const token = await getToken();
      const storedUser = await getUser();
      if (token && storedUser) {
        setUser(storedUser);
      }
      setIsLoading(false);
    };
    loadStoredData();
  }, []);

  const login = async (username, password) => {
    console.log('Logging in using', BASE_URL);
    try {
      const response = await api.post('/api/login', { username, password });
      const { access_token, username: uname, full_name } = response.data;
      const userData = { username: uname, full_name: full_name || uname };
      await storeToken(access_token, userData);
      setUser(userData);
      Toast.show({ type: 'success', text1: 'Login successful' });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      const msg = error.response?.data?.detail || error.message || 'Login failed';
      Toast.show({ type: 'error', text1: msg });
      return false;
    }
  };

  const signup = async (username, password, fullName) => {
    console.log('Signing up using', BASE_URL);
    try {
      const response = await api.post('/api/signup', {
        username,
        password,
        full_name: fullName,
      });
      const { access_token, username: uname, full_name } = response.data;
      const userData = { username: uname, full_name: full_name || fullName };
      await storeToken(access_token, userData);
      setUser(userData);
      Toast.show({ type: 'success', text1: 'Signup successful' });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      const msg = error.response?.data?.detail || error.message || 'Signup failed';
      Toast.show({ type: 'error', text1: msg });
      return false;
    }
  };

  const logout = async () => {
    await clearAuth();
    setUser(null);
    Toast.show({ type: 'info', text1: 'Logged out' });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);