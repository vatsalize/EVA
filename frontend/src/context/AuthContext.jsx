import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('eva_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and verify authentication on load
  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('eva_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
          localStorage.setItem('eva_user', JSON.stringify(res.data.user));
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const loginStudent = async (email, password) => {
    const res = await api.post('/auth/student/login', { email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('eva_token', res.data.token);
      localStorage.setItem('eva_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const loginCoordinator = async (coordinatorId, password) => {
    const res = await api.post('/auth/coordinator/login', { coordinatorId, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('eva_token', res.data.token);
      localStorage.setItem('eva_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const signupStudent = async (formData) => {
    const res = await api.post('/auth/student/signup', formData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('eva_token', res.data.token);
      localStorage.setItem('eva_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('eva_token');
    localStorage.removeItem('eva_user');
  };

  const changePassword = async (currentPassword, newPassword) => {
    const res = await api.post('/auth/change-password', { currentPassword, newPassword });
    if (res.data.success) {
      setUser((prev) => (prev ? { ...prev, mustChangePassword: false } : prev));
    }
    return res.data;
  };

  const updateProfile = async (data) => {
    const res = await api.put('/users/profile', data);
    if (res.data.success) {
      setUser((prev) => ({ ...prev, ...res.data.user }));
    }
    return res.data;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    isStudent: user?.role === 'STUDENT',
    isCoordinator: user?.role === 'COORDINATOR',
    loginStudent,
    loginCoordinator,
    signupStudent,
    logout,
    changePassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
