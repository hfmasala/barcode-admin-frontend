import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // We can store user details here
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const navigate = useNavigate();

  useEffect(() => {
    // On app load, check if token exists and is valid
    if (token) {
      // We should ideally verify the token here by calling a /api/users/me endpoint
      // For now, we'll just assume it's valid if it exists
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Let's set a dummy user for now
      setUser({ email: 'user' }); // In a real app, fetch this from backend
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      // The backend expects 'username' and 'password' in a FormData
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const response = await api.post('/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token } = response.data;
      
      // Save to state and local storage
      setToken(access_token);
      setUser({ email }); // Set a temporary user
      localStorage.setItem('access_token', access_token);
      
      // Update axios headers for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Redirect to dashboard
      navigate('/'); // We'll create this page next
      
      return true;

    } catch (error) {
      console.error('Login failed:', error);
      // We should show a user-friendly error message
      return false;
    }
  };

  const logout = () => {
    // Clear everything
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login'); // Redirect to login
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to easily use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};