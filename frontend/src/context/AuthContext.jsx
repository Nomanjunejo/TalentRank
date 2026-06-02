import React, { createContext, useContext, useState, useCallback } from 'react';
import { loginApi, registerApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(() => {
    const stored = localStorage.getItem('tr_user');
    const token = localStorage.getItem('tr_token');
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const persist = (data) => {
    localStorage.setItem('tr_token', data.access_token);
    const u = {
      user_id: data.user_id,
      email: data.email,
      role: data.role,
      profile_id: data.profile_id,
    };
    localStorage.setItem('tr_user', JSON.stringify(u));
    setUser(u);
    return u;
  };

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    return persist(res.data);
  };

  const register = async (payload) => {
    const res = await registerApi(payload);
    return persist(res.data);
  };

  const logout = () => {
    localStorage.removeItem('tr_token');
    localStorage.removeItem('tr_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, bootstrap }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
