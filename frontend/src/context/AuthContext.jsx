import { createContext, useContext, useState, useEffect } from 'react';

// Auth Context - Manages JWT authentication state across the app
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize token from localStorage (persists across page refreshes)
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(localStorage.getItem('user'));

  // Login - Store JWT token
  const login = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', username);
    setToken(token);
    setUser(username);
  };

  // Logout - Clear JWT token
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Check if user is authenticated
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
