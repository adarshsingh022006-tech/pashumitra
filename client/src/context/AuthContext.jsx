import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pashumitra_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('pashumitra_token') || null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState(() => localStorage.getItem('pashumitra_lang') || 'en');

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(res => {
          setUser(res.data.user);
          localStorage.setItem('pashumitra_user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          // Token invalid
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { user: userData, token: jwtToken } = res.data;
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('pashumitra_token', jwtToken);
    localStorage.setItem('pashumitra_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    const { user: userData, token: jwtToken } = res.data;
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('pashumitra_token', jwtToken);
    localStorage.setItem('pashumitra_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pashumitra_token');
    localStorage.removeItem('pashumitra_user');
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('pashumitra_lang', lang);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      language,
      changeLanguage,
      role: user?.role || 'guest'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
