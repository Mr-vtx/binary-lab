import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); 
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const { data } = await api.get('/user/me');
      setProfile(data);
      setUser(data.user);
    } catch {
      logout();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('bl_token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('bl_token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    await loadProfile();
    return data;
  };

  const register = async (email, username, password) => {
    const { data } = await api.post('/auth/register', { email, username, password });
    localStorage.setItem('bl_token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    await loadProfile();
    return data;
  };

  const logout = () => {
    localStorage.removeItem('bl_token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = () => loadProfile();

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
